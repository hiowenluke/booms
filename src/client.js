
const grpc = require('grpc');
const keyPaths = require('keypaths');

const config = require('./config');
const Proto = require('./Proto');
const myJson = require('./__lib/myJson');
const myRedis = require('./__lib/myRedis');

let isInitialized;

const cache = {
	data: {},

	getByNames(names, leftNames) {
		const services = {};
		names.forEach(name => {
			if (this.data[name]) {
				services[name] = this.data[name];
			}
			else {
				leftNames.push(name);
			}
		});

		return services;
	},

	add(name, service) {
		this.data[name] = service;
	}
};

const attachCallFunction = (service, obj, path = '') => {
	Object.keys(obj).forEach(key => {
		const node = obj[key];
		const subPath = path + key;

		// If it is ending node, replace it with function
		if (!Object.keys(node).length) {
			obj[key] = async (...args) => {
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
	init(...args) {
		if (!isInitialized) {
			isInitialized = 1;

			const {redisConfig} = config.getAllConfigurations(args);
			myRedis.init(redisConfig);
		}

		return this.get;
	},

	async get(...args) {
		try {
			let serviceNames = args;

			if (!serviceNames.length) {
				serviceNames = await myRedis.getAllServiceNames();
			}

			const leftNames = [];
			const services = cache.getByNames(serviceNames, leftNames);

			// Get the left services by names
			for (let i = 0; i < leftNames.length; i ++) {
				const serviceName = leftNames[i];
				const {host, port, paths} = await myRedis.getServiceData(serviceName);

				const proto = Proto.create(serviceName);
				const service = new proto.Main(`${host}:${port}`, grpc.credentials.createInsecure());
				const obj = keyPaths.toObject(paths);

				attachCallFunction(service, obj);
				cache.add(serviceName, obj);

				services[serviceName] = obj;
			}

			return services;
		}
		catch(e) {
			console.log(e);
		}
	}
};

module.exports = me;
