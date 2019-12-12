
const grpc = require('grpc');
const keyPaths = require('keypaths');

const config = require('./config');
const Proto = require('./Proto');
const myJson = require('./__lib/myJson');
const myRedis = require('./__lib/myRedis');

let isInitialized;
let isServicesFetched;

const attachCallFunction = (service, obj, path = '') => {
	Object.keys(obj).forEach(key => {
		const node = obj[key];
		const subPath = path + key;

		// If it is ending node, replace it with function
		if (!Object.keys(node).length) {
			obj[key] = (...args) => {
				return new Promise(resolve => {
					service.proxy({funcName: subPath, argsStr: JSON.stringify(args)}, (err, response) => {
						const message = response.message;
						const result = myJson.parse(message);
						resolve(result);
					});
				});
			};
		}
		else {
			// Recursion
			attachCallFunction(service, node, subPath + '.');
		}
	});
};

const me = {
	services: {},

	init(...args) {
		if (!isInitialized) {
			isInitialized = 1;

			const {redisConfig} = config.getAllConfigurations(args);
			myRedis.init(redisConfig);
		}

		return this.get.bind(this);
	},

	async fetchServices() {
		const names = await myRedis.getAllServiceNames();

		for (let i = 0; i < names.length; i ++) {
			const name = names[i];
			const {host, port, apis} = await myRedis.getServiceData(name);

			const proto = Proto.create(name);
			const service = new proto.Main(`${host}:${port}`, grpc.credentials.createInsecure());

			const obj = keyPaths.toObject(apis);
			attachCallFunction(service, obj);

			this.services[name] = obj;
		}
	},

	async get(...names) {
		try {
			if (!isServicesFetched) {
				isServicesFetched = 1;
				await this.fetchServices();
			}

			if (!names.length) {
				return this.services;
			}
			else {
				const services = {};
				for (let i = 0; i < names.length; i ++) {
					const name = names[i];
					const obj = this.services[name];
					services[name] = obj;
				}
				return services;
			}
		}
		catch(e) {
			console.log(e);
		}
	}
};

module.exports = me;
