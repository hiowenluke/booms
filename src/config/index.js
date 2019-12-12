
const getAllConfigurations = require('./getAllConfigurations');

const me = {
	booms: {
		folder: './src',
		name: '', // Microservice name
	},

	gRPC: {
		host: 'localhost',
	},

	redis: {
		host: 'localhost',
	},

	getAllConfigurations(args) {
		const {boomsConfig, grpcConfig, redisConfig} = getAllConfigurations(args, this);
		return {boomsConfig, grpcConfig, redisConfig};
	}
};

module.exports = me;
