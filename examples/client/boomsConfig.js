
// This file can be omitted if the following options are all the default value.
// This file can be a hidden file ".boomsConfig.js"

const me = {

	// It can be omitted if it is 'localhost'
	redis: {
		host: 'localhost',
	},

	// The names of the remote servers which will be fetched.
	// If it is omitted or 'all', Booms will fetches all.
	// Or "s1" if you just need this one.
	servers: ['s1', 's2'],

	// Whether to create boomsServices.js.
	// It can be omitted if it is true.
	yesBoomsServicesFile: true,
};

module.exports = me;
