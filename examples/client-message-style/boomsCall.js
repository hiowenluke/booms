
const options = {

	// It can be omitted if it is 'localhost'
	redis: {
		host: 'localhost',
	}
};

const call = require('../..').client.call(options);
module.exports = call;
