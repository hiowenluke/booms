
const myJson = require('../__lib/myJson');
const rpcArgs = require('./rpcArgs');

const fn = (service, name, api, args) => {
	return new Promise(resolve => {
		args = rpcArgs.encode(args);

		service.proxy({funcName: api, argsStr: JSON.stringify(args)}, (err, response) => {
			if (!response) {
				throw new Error(`Service ${name} is not available. Is it running?`);
			}
			const message = response.message;
			const result = myJson.parse(message);
			resolve(result);
		});
	})
};

module.exports = fn;
