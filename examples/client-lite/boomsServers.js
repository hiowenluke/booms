
const options = {
	redis: {
		host: 'localhost',
	}
};

const services = require('../../src').client.servers(options);
module.exports = services;
