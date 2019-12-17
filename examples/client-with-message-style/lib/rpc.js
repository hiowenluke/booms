
const options = {
	redis: {
		host: 'localhost',
	}
};

const rpc = require('../../../src').initRpc(options);
module.exports = rpc;
