
const grpc = require('grpc');
const keyPaths = require('keypaths');

const config = require('./config');
const Proto = require('./Proto');
const myJson = require('./__lib/myJson');
const myRedis = require('./__lib/myRedis');

let isInitialized;
let isServicesFetched;

const attachCallFunction = (service, apis) => {
	const obj = {};

	apis.forEach(api => {
		obj[api] = (...args) => {
			return new Promise(resolve => {
				service.proxy({funcName: api, argsStr: JSON.stringify(args)}, (err, response) => {
					const message = response.message;
					const result = myJson.parse(message);
					resolve(result);
				});
			});
		};
	});

	return obj;
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

			const obj = attachCallFunction(service, apis);
			this.services[name] = obj;
		}
	},

	async get(apiPath, ...args) {
		try {
			if (!isServicesFetched) {
				isServicesFetched = 1;
				await this.fetchServices();
			}

			const [serviceName, api] = apiPath.split(':');
			const service = this.services[serviceName];

			const apix = (() => {
				if (api.indexOf('/') >= 0) {
					return api.replace(/^\//, '').replace(/\//g, '.');
				}
				else {
					return api;
				}
			})();

			const result = await service[apix](...args);
			return result;
		}
		catch(e) {
			console.log(e);
		}
	}
};

module.exports = me;
