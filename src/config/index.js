
const getAllConfigurations = require('./getAllConfigurations');

const me = {
	dooms: {
		folder: './src',
		name: '', // Microservice name
		redisPrefix: 'rpc_dooms_',
		startingPort: 50051,
	},

	gRPC: {
		host: 'localhost',
	},

	redis: {
		host: 'localhost',
	},

	getAllConfigurations(args) {
		const {doomsConfig, grpcConfig, redisConfig} = getAllConfigurations(args, this);
		return {doomsConfig, grpcConfig, redisConfig};
	}
};

module.exports = me;
