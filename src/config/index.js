
const argOptions = require('./argOptions');

const me = {
	dooms: {
		folder: './src',
		name: '', // Microservice name
	},

	gRPC: {
		host: 'localhost',
	},

	redis: {
		host: 'localhost',
	},

	// from initServices: [options]
	// from initServer: ['s1', './src', options]
	getAllConfigurations(args) {
		const {doomsConfig, grpcConfig, redisConfig} = argOptions(args, this);
		return {doomsConfig, grpcConfig, redisConfig};
	}
};

module.exports = me;
