
const grpc = require('../../../../node_modules/grpc');
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

const getProxyPromise = (service, api, args) => {
	return new Promise(resolve => {
		args = args.map(item => item === undefined ? UNDEFINED : item);
		service.proxy({funcName: api, argsStr: JSON.stringify(args)}, (err, response) => {
			const message = response.message;
			const result = message === UNDEFINED ? undefined : JSON.parse(message);
			resolve(result);
		});
	})
};

const fn = (name, host, port, subPath, args) => {
	const service = services.get(name, host, port);
	return getProxyPromise(service, subPath, args);
};

module.exports = fn;
