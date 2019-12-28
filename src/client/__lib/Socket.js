
const net = require('net');

const me = {
	new(name, host, port) {
		const socket = new net.Socket();
		socket.on('error', (ex) => {
			console.log(`[WARN] Server ${name} is not available.`);
		});
		socket.connect(port, host);
		return socket;
	}
};

module.exports = me;
