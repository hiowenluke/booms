
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

	// This is just for note, it is not be used indeed
	client: {
		servers: null,
		yesBoomsServicesFile: true,
	},
};

module.exports = me;
