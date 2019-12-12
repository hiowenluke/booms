
const grpc = require('grpc');
const kdo = require('kdo');
const path = require('path');
const keyPaths = require('keypaths');

const config = require('./config');
const Proto = require('./Proto');
const myJson = require('./__lib/myJson');
const myRedis = require('./__lib/myRedis');
const ports = require('./__lib/ports');

const me = {
	definition: [],
	source: {},
	port: null,

	async init(caller, ...args) {
		try {
			const {doomsConfig, grpcConfig, redisConfig} = config.getAllConfigurations(args);
			myRedis.init(redisConfig);
			ports.init(myRedis);

			await this.initSource(caller, doomsConfig);
			await this.initDefinition(doomsConfig);
			await this.calcServicePort(doomsConfig);
			await this.saveToRedis(doomsConfig, grpcConfig, redisConfig);
			await this.createService(doomsConfig);
		}
		catch(e) {
			console.log(e);
		}
	},

	async initSource(caller, doomsConfig) {
		const {folder} = doomsConfig;
		const root = path.resolve(caller, '..');
		this.source = kdo(root + '/' + folder);
	},

	async initDefinition(doomsConfig) {
		const serviceName = doomsConfig.name;
		const proto = Proto.create(serviceName);

		const proxy = async (call, callback) => {
			const funcName = call.request.funcName;
			const argsStr = call.request.argsStr;
			const args = JSON.parse(argsStr);

			const fn = keyPaths.get(this.source, funcName);
			const result = await fn(...args);
			const resultStr = myJson.stringify(result);

			callback(null, {message: resultStr});
		};

		this.definition = [proto.Main.service, {proxy}];
	},

	async calcServicePort(doomsConfig) {
		this.port = await ports.calc(doomsConfig.name);
	},

	async saveToRedis(doomsConfig, grpcConfig) {
		const {name} = doomsConfig;
		const {host} = grpcConfig;

		const port = this.port;
		const apis = keyPaths.toPaths(this.source);
		const data = {host, port, apis};

		await myRedis.saveServiceData(name, data);
	},

	async createService(doomsConfig) {
		const service = new grpc.Server();

		service.addService(...this.definition);
		service.bind(`0.0.0.0:${this.port}`, grpc.ServerCredentials.createInsecure());
		service.start();

		console.log(`Service ${doomsConfig.name} is running on port ${this.port}...`);
	}
};

module.exports = me;
