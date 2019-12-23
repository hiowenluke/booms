
module.exports = {

	// It can be omitted if it is 'localhost'
	redis: {
		host: 'localhost',
	},

	// The names of the remote servers which will be fetched.
	// If it is omitted, Booms will fetches all.
	// Or "s1" if you just need this one.
	servers: ['s1', 's2'],
};

// This file can also be .boomsConfig.js
// if you wanna to hide it in the project root directory.
