
const options = {
	redis: {
		host: 'localhost',
	}
};

const call = require('../../../src').initCall(options);
module.exports = call;
