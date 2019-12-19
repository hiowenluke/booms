
const getAllConfigurations = require('./getAllConfigurations');

const me = {
	booms: {
		folder: './src',
		name: 's1', // Server name
	},

	server: {
		host: 'localhost',
	},

	redis: {
		host: 'localhost',
	},

	getAllConfigurations(args) {
		const {boomsConfig, serverConfig, redisConfig} = getAllConfigurations(args, this);
		return {boomsConfig, serverConfig, redisConfig};
	}
};

module.exports = me;
