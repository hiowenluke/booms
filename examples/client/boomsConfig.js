
module.exports = {

	// It can be omitted if it is 'localhost'
	redis: {
		host: 'localhost',
	},

	// The names of the remote servers which will be fetched.
	// If it is omitted, Booms will fetches all.
	// Or "s1" if you just need one.
	servers: ['s1', 's2'],

	// The timer of fetching remote services definitions
	// If it is 0, Booms will does fetch only once.
	// When the remote services change frequently, set it as 10 or more bigger.
	timer: 10,
};

// This file also can be .boomsConfig.js
// if you wanna to hide it in the project root directory.
