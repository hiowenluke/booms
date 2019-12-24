
// This file is just for call.js and lite.js.
// The omg does not require it.

const config = require('../__config');

const fn = (args) => {
	let boomsConfig = {};
	let redisConfig = {};

	// No arguments
	if (!args.length) {
		// do nothing
	}
	else {
		// ({redis: {host: 'localhost'}})
		if (typeof args[0] === 'object') {
			const options = args[0];
			redisConfig = options.redis;
		}
		else {
			throw new Error(`Error options`);
		}
	}

	boomsConfig = Object.assign({}, config.client, boomsConfig);
	redisConfig = Object.assign({}, config.redis, redisConfig);

	return {boomsConfig, redisConfig};
};

module.exports = fn;
