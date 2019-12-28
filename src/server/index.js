
const net = require('net');
const kdo = require('kdo');
const path = require('path');
const keyPaths = require('keypaths');

const myJson = require('../__lib/myJson');
const myRedis = require('../__lib/myRedis');
const rpcArgs = require('../__lib/rpcArgs');

const ports = require('./ports');
const parseUserConfig = require('./parseUserConfig');

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
				const [funcName, args] = myJson.parseMessage(message);

				const fn = keyPaths.get(this.source, funcName);
				if (!fn) {
					throw new Error(`API ${funcName} can not be found on server ${name}`);
				}

				let result;
				try {
					const argsOk = rpcArgs.decode(args);
					result = await fn(...argsOk);
				}
				catch(e) {
					console.log(e);
				}

				const resultStr = myJson.stringify(result);
				sock.write(resultStr);
			});
		});

		server.listen(port, host);
		console.log(`Server ${name} listening on ${host}:${port}`);
	}
};

module.exports = me;
