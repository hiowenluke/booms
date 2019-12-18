
const grpc = require('grpc');
const Proto = require('./Proto');

const UNDEFINED = '__undefined__';

const services = {
	data: {},

	get(name, host, port) {
		if (!this.data[name]) {
			const proto = Proto.create(name);
			const service = new proto.Main(`${host}:${port}`, grpc.credentials.createInsecure());
			this.data[name] = service;
		}
		return this.data[name];
	}
};

const getProxyPromise = (service, name, api, args) => {
	return new Promise(resolve => {
		args = args.map(item => item === undefined ? UNDEFINED : item);
		service.proxy({funcName: api, argsStr: JSON.stringify(args)}, (err, response) => {
			if (!response) {
				throw new Error(`Service ${name} is not available. Is it running?`);
			}
			const message = response.message;
			const result = message === UNDEFINED ? undefined : JSON.parse(message);
			resolve(result);
		});
	})
};

const fn = (name, host, port, subPath, args) => {
	const service = services.get(name, host, port);
	return getProxyPromise(service, name, subPath, args);
};

module.exports = fn;
