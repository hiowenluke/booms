
const net = require('net');
const rpcArgs = require('./lib/rpcArgs');
const myJson = require('./lib/myJson');

const clients = {
	data: {},

	get(serverName, host, port) {
		if (!this.data[serverName]) {
			const client = new net.Socket();
			client.connect(port, host);

			this.data[serverName] = client;
		}

		return this.data[serverName];
	}
};

const proxy = (client, serverName, api, args) => {
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

const fn = (serverName, host, port, subPath, args) => {
	const client = clients.get(serverName, host, port);
	return proxy(client, serverName, subPath, args);
};

module.exports = fn;
