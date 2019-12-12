
const options = {
	redis: {
		host: 'localhost',
	}
};

const services = require('../../../src').initClient(options);
module.exports = services;
