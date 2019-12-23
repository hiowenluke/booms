
const getAllConfigurations = require('./getAllConfigurations');

const me = {
	booms: {
		name: 's1', // Server name
		dir: './src',
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
