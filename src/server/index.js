
const net = require('net');
const kdo = require('kdo');
const path = require('path');
const keyPaths = require('keypaths');

const myJson = require('../__lib/myJson');
const myRedis = require('../__lib/myRedis');
const rpcArgs = require('../__lib/rpcArgs');

const ports = require('./ports');
const parseUserConfig = require('./parseUserConfig');

const Emitter = require('events').EventEmitter;
const myEmitter = new Emitter;

const cache = {
	fns: {},
	pms: {},

	getFnByName(source, funcName) {
		if (!this.fns[funcName]) {
			this.fns[funcName] = keyPaths.get(source, funcName);
		}
		return this.fns[funcName];
	},

	getParsedMessage(message) {
		if (!this.pms[message]) {
			this.pms[message] = myJson.parseMessage(message);
		}
		return this.pms[message];
	}
};

const me = {
	source: {},

	async init(caller, ...args) {
		try {
			const {boomsConfig, redisConfig} = parseUserConfig(args);
			myRedis.init(redisConfig);
			ports.init(myRedis);

			await this.initSource(caller, boomsConfig);
			await this.calcServerPort(boomsConfig);
			await this.saveServerData(boomsConfig);
			await this.createServer(boomsConfig);

			myRedis.disconnect();
		}
		catch(e) {
			console.log(e);
		}
	},

	async initSource(caller, boomsConfig) {
		const {dir} = boomsConfig;
		const root = path.resolve(caller, '..');
		this.source = kdo(root + '/' + dir);
	},

	async calcServerPort(boomsConfig) {
		boomsConfig.port = await ports.calc(boomsConfig.name);
	},

	async saveServerData(boomsConfig) {
		const {name, host, port} = boomsConfig;

		const apis = keyPaths.toPaths(this.source);
		const data = {host, port, apis};

		await myRedis.saveServerData(name, data);
	},

	async createServer(boomsConfig) {
		const {name, host, port} = boomsConfig;

		const server = net.createServer(sock => {
			sock.on('data', async data => {
				const message = data.toString();

				// Received the result of callback from the client
				if (message.substr(0, 22) === 'booms_callback_result#') {
					const resultMessage = message.substr(22);
					myEmitter.emit('cb_result', resultMessage);
					return;
				}

				// Handle the normal rpc
				const [funcName, args] = cache.getParsedMessage(message);
				const fn = cache.getFnByName(this.source, funcName);
				if (!fn) {
					throw new Error(`API ${funcName} can not be found on server ${name}`);
				}

				let result;
				try {
					let argsOk = rpcArgs.decode(args);
					if (argsOk.find(arg => arg === rpcArgs.FUNCTION)) {
						argsOk = argsOk.map((arg, index) => {

							// Create an asynchronous function for callback function
							if (arg === rpcArgs.FUNCTION)	{
								return (...args) => {
									const argsStr = myJson.stringify(args);
									return new Promise(resolve => {

										// Return the result of callback
										myEmitter.once('cb_result', (resultMessage) => {
											const result = myJson.parse(resultMessage);
											resolve(result);
										});

										// Tell the client to perform the callback function
										sock.write( 'booms_callback_do_' + index + '#' + argsStr);
									})
								};
							}
							else {
								return arg;
							}
						});
					}

					result = await fn(...argsOk);

					const resultStr = myJson.stringify(result);
					sock.write(resultStr);
				}
				catch(e) {
					console.log(e);
				}
			});
		});

		server.listen(port, host);
		console.log(`Server ${name} listening on ${host}:${port}`);
	}
};

module.exports = me;
