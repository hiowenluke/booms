
// This options can be omitted if options.redis.host is 'localhost'
const options = {
	redis: {
		host: 'localhost',
	}
};

require('../../src').initClient(options);
