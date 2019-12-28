
const Socket = require('./socket');
const proxy = require('./proxy');

const clients = {
	data: {},

	get(serverName, host, port) {
		if (!this.data[serverName]) {
			const client = Socket.new(serverName, host, port);
			this.data[serverName] = client;
		}

		return this.data[serverName];
	}
};

const fn = (serverName, host, port, subPath, args) => {
	const client = clients.get(serverName, host, port);
	return proxy(client, serverName, subPath, args);
};

module.exports = fn;
