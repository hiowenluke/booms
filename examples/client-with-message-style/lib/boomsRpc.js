
const options = {
	redis: {
		host: 'localhost',
	}
};

const call = require('../../../src').initRpc(options);
module.exports = call;
