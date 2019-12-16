
const myJson = require('../__lib/myJson');
const rpcArgs = require('./rpcArgs');

const fn = (service, api, args) => {
	return new Promise(resolve => {
		args = rpcArgs.encode(args);

		service.proxy({funcName: api, argsStr: JSON.stringify(args)}, (err, response) => {
			const message = response.message;
			const result = myJson.parse(message);
			resolve(result);
		});
	})
};

module.exports = fn;
