
// This options can be omitted if options.redis.host is 'localhost'
const options = {
	redis: {
		host: 'localhost',
	}
};

const services = require('../..').client.services(options);
module.exports = services;