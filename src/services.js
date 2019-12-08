
const myRedis = require('./__lib/myRedis');
const RPC = require('grpc');
const config = require('./config');
const lib = require('./__lib');

let rpc;
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

const attachCallFunction = (obj, path = '', serviceName) => {
	Object.keys(obj).forEach(key => {
		const node = obj[key];

		// If it is ending node, replace it with function
		if (!Object.keys(node).length) {
			obj[key] = async (...args) => {
				const queue = (serviceName ? serviceName + ':' : '') + path + '/' + key;
				return await rpc.call(config.queuePrefix + queue, ...args);
			};
		}
		else {
			// Recursion
			attachCallFunction(node, path + '/' + key, serviceName);
		}
	});
};

const me = {
	init(options = {}) {
		if (!isInitialized) {
			isInitialized = 1;

			const {redisConfig, grpcConfig} = config.getAllConfigurations([options]);
			myRedis.init(redisConfig);
			rpc = RPC(grpcConfig);
		}

		return this.get;
	},

	async get(...names) {
		try {
			const serviceNames = names.length ? names : await myRedis.getAllServiceNames();
			if (!serviceNames.length) return {};

			const leftNames = [];
			const services = cache.getByNames(serviceNames, leftNames);

			// Get the left services by names
			for (let i = 0; i < leftNames.length; i ++) {
				const serviceName = leftNames[i];
				const string = await myRedis.getServiceData(serviceName);
				const keyPaths = string.split(',');
				const obj = lib.pathsToObj(keyPaths);

				attachCallFunction(obj, '', serviceName);

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
