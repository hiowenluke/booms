
const myJson = require('../../__lib/myJson');
const rpcArgs = require('../../__lib/rpcArgs');

const fn = (client, serverName, api, args) => {
	return new Promise(resolve => {
		args = rpcArgs.encode(args);

		client.once('data', data => {
			if (!data) {
				throw new Error(`Server ${serverName} is not available. Is it running?`);
			}

			const message = data.toString();
			const result = myJson.parse(message);
			resolve(result);
		});

		const argsStr = myJson.stringify(args);
		client.write(api + '#' + argsStr);
	})
};

module.exports = fn;
