
const grpc = require('grpc');
const Proto = require('./Proto');

const UNDEFINED = '__undefined__';

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
	const proto = Proto.create(name);
	const service = new proto.Main(`${host}:${port}`, grpc.credentials.createInsecure());
	return getProxyPromise(service, subPath, args);
};

module.exports = fn;
