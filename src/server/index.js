
const net = require('net');
const kdo = require('kdo');
const path = require('path');
const keyPaths = require('keypaths');

const config = require('../__config');
const myJson = require('../__lib/myJson');
const myRedis = require('../__lib/myRedis');
const rpcArgs = require('../__lib/rpcArgs');
const ports = require('./ports');

const me = {
	source: {},

	async init(caller, ...args) {
		try {
			const {boomsConfig, serverConfig, redisConfig} = config.getAllConfigurations(args);
			myRedis.init(redisConfig);
			ports.init(myRedis);

			await this.initSource(caller, boomsConfig);
			await this.calcServerPort(boomsConfig, serverConfig);
			await this.saveServerData(boomsConfig, serverConfig, redisConfig);
			await this.createServer(boomsConfig, serverConfig);

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

	async calcServerPort(boomsConfig, serverConfig) {
		serverConfig.port = await ports.calc(boomsConfig.name);
	},

	async saveServerData(boomsConfig, serverConfig) {
		const {name} = boomsConfig;
		const {host, port} = serverConfig;

		const apis = keyPaths.toPaths(this.source);
		const data = {host, port, apis};

		await myRedis.saveServerData(name, data);
	},

	async createServer(boomsConfig, serverConfig) {
		const server = net.createServer(sock => {
			sock.on('data', async data => {
				const message = data.toString();
				const [funcName, args] = myJson.parseMessage(message);
				const argsOk = rpcArgs.decode(args);

				const fn = keyPaths.get(this.source, funcName);
				const result = await fn(...argsOk);
				if (!fn) {
					throw new Error(`API ${funcName} can not be found on server ${name}`);
				}

				const resultStr = myJson.stringify(result);
				sock.write(resultStr);
			});
		});

		const {host, port} = serverConfig;
		server.listen(port, host);

		const {name} = boomsConfig;
		console.log(`Server ${name} listening on ${host}:${port}`);
	}
};

module.exports = me;
