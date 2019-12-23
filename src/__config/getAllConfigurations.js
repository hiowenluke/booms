
// from fetchServers: [options]
// from fetchServers: ['s1', './src', options]
const fn = (args, defaultOptions) => {
	let boomsConfig = {};
	let serverConfig = {};
	let redisConfig = {};

	// No arguments
	if (!args.length) {
		// do nothing
	}
	else {
		let ax = args[args.length - 1];

		// {name: 's1', dir: './lib', {server: {host: 'localhost'}, redis: {host: 'localhost'}}}
		// {name: 's1', dir: './lib', {host: 'localhost'}}
		if (typeof ax === 'object') {
			boomsConfig = {name: ax.name, dir: ax.dir};
			serverConfig = ax.server;
			redisConfig = ax.redis;

			// {host} => {server: {host}}
			if (ax.host) {
				serverConfig.host = ax.host;
			}

			args.pop();
		}

		// ('s1', './lib')
		if (args.length) {
			let [a0, a1] = args;

			// The first arg is directory name
			// 		('./lib')
			// 		('./lib', 's1')
			if (a0.substr(0, 1) === '.') {
				boomsConfig.dir = a0;
				a1 && (boomsConfig.name = a1);
			}
			else {
				// The first arg is service name
				// 		('s1')
				// 		('s1', './lib')
				boomsConfig.name = a0;
				a1 && (boomsConfig.dir = a1);
			}
		}
	}

	boomsConfig = Object.assign({}, defaultOptions.booms, boomsConfig);
	serverConfig = Object.assign({}, defaultOptions.server, serverConfig);
	redisConfig = Object.assign({}, defaultOptions.redis, redisConfig);

	return {boomsConfig, serverConfig, redisConfig};
};

module.exports = fn;
