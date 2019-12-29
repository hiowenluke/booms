
const me = {
	server: {
		name: 's1', // Server name
		dir: './src',
		host: 'localhost',
		basePort: 30201, // The starting port number
	},

	redis: {
		host: 'localhost',
	},

	client: {
		servers: 'all',
		yesBoomsServicesFile: true,
	},
};

module.exports = me;
