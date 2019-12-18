
const grpc = require('grpc');
const kdo = require('kdo');
const path = require('path');
const keyPaths = require('keypaths');

const config = require('./config');
const Proto = require('./Proto');
const myJson = require('./__lib/myJson');
const myRedis = require('./__lib/myRedis');
const ports = require('./__lib/ports');
const rpcArgs = require('./gRPC/rpcArgs');

const me = {
	definition: [],
	source: {},
	port: null,

	async init(caller, ...args) {
		try {
			const {boomsConfig, grpcConfig, redisConfig} = config.getAllConfigurations(args);
			myRedis.init(redisConfig);
			ports.init(myRedis);

			await this.initSource(caller, boomsConfig);
			await this.initDefinition(boomsConfig);
			await this.calcServicePort(boomsConfig);
			await this.saveToRedis(boomsConfig, grpcConfig, redisConfig);
			await this.createService(boomsConfig);

			myRedis.disconnect();
		}
		catch(e) {
			console.log(e);
		}
	},

	async initSource(caller, boomsConfig) {
		const {folder} = boomsConfig;
		const root = path.resolve(caller, '..');
		this.source = kdo(root + '/' + folder);
	},

	async initDefinition(boomsConfig) {
		const serviceName = boomsConfig.name;
		const proto = Proto.create(serviceName);

		const proxy = async (call, callback) => {
			const funcName = call.request.funcName;
			const argsStr = call.request.argsStr;

			let args = JSON.parse(argsStr);
			args = rpcArgs.decode(args);

			const fn = keyPaths.get(this.source, funcName);
			const result = await fn(...args);
			const resultStr = myJson.stringify(result);

			callback(null, {message: resultStr});
		};

		this.definition = [proto.Main.service, {proxy}];
	},

	async calcServicePort(boomsConfig) {
		this.port = await ports.calc(boomsConfig.name);
	},

	async saveToRedis(boomsConfig, grpcConfig) {
		const {name} = boomsConfig;
		const {host} = grpcConfig;

		const port = this.port;
		const apis = keyPaths.toPaths(this.source);
		const data = {host, port, apis};

		await myRedis.saveServiceData(name, data);
	},

	async createService(boomsConfig) {
		const service = new grpc.Server();

		service.addService(...this.definition);
		service.bind(`0.0.0.0:${this.port}`, grpc.ServerCredentials.createInsecure());
		service.start();

		console.log(`Service ${boomsConfig.name} is running on port ${this.port}...`);
	}
};

module.exports = me;
