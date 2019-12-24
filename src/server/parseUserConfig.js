
const config = require('../__config');

const fn = (args) => {
	let boomsConfig = {};
	let redisConfig = {};

	// No arguments
	if (!args.length) {
		// do nothing
	}
	else {
		// ({name: 's1', dir: './src', host: 'localhost', redis: {host: 'localhost'}})
		if (typeof args[0] === 'object') {
			const options = args[0];
			boomsConfig.name = options.name;
			boomsConfig.dir = options.dir;
			boomsConfig.host = options.host;
			redisConfig = options.redis;
		}
		else {
			// ('s1', './src', 'localhost', {redis: {host: 'localhost'}})
			args.forEach(arg => {
				if (!arg) return;

				const type = typeof arg;
				if (type === 'object') {
					const options = arg;
					redisConfig = options.redis;
				}
				else if (type === 'string') {
					if (arg.substr(0, 1) === '.') {
						boomsConfig.dir = arg;
					}
					else if (arg !== 'localhost' && arg.indexOf('.') === -1) {
						boomsConfig.name = arg;
					}
					else {
						boomsConfig.host = arg;
					}
				}
			});
		}
	}

	boomsConfig = Object.assign({}, config.server, boomsConfig);
	redisConfig = Object.assign({}, config.redis, redisConfig);

	return {boomsConfig, redisConfig};
};

module.exports = fn;
