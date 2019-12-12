
// from initClient: [options]
// from initClient: ['s1', './src', options]
const fn = (args, defaultOptions) => {
	let boomsConfig = {};
	let grpcConfig = {};
	let redisConfig = {};

	// No arguments
	if (!args.length) {
		// do nothing
	}
	else {
		let ax = args[args.length - 1];

		// {name: 's1', folder: './lib', {gRPC: {host: 'localhost'}, redis: {host: 'localhost'}}}
		// {name: 's1', folder: './lib', {host: 'localhost'}}
		if (typeof ax === 'object') {
			boomsConfig = {name: ax.name, folder: ax.folder};
			grpcConfig = ax.gRPC;
			redisConfig = ax.redis;

			// {host} => {gRPC: {host}}
			if (ax.host) {
				grpcConfig.host = ax.host;
			}

			args.pop();
		}

		// ('s1', './lib')
		if (args.length) {
			let [a0, a1] = args;

			// The first arg is folder name
			// 		('./lib')
			// 		('./lib', 's1')
			if (a0.substr(0, 1) === '.') {
				boomsConfig.folder = a0;
				a1 && (boomsConfig.name = a1);
			}
			else {
				// The first arg is service name
				// 		('s1')
				// 		('s1', './lib')
				boomsConfig.name = a0;
				a1 && (boomsConfig.folder = a1);
			}
		}
	}

	boomsConfig = Object.assign({}, defaultOptions.booms, boomsConfig);
	grpcConfig = Object.assign({}, defaultOptions.gRPC, grpcConfig);
	redisConfig = Object.assign({}, defaultOptions.redis, redisConfig);

	return {boomsConfig, grpcConfig, redisConfig};
};

module.exports = fn;
