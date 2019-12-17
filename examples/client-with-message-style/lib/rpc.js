
// This options can be omitted if options.redis.host is 'localhost'
const options = {
	redis: {
		host: 'localhost',
	}
};

const rpc = require('../../../src').initRpc(options);
module.exports = rpc;
