
// This options can be omitted if options.redis.host is 'localhost'
const options = {
	redis: {
		host: 'localhost',
	}
};

// The names of the remote services which will be fetched.
// If it is omitted, Booms will fetches all.
const serverNames = ['s1', 's2']; // Or "s1" if you just need it.

// The folder where the remote services definitions will be stored.
// It must be same as require('./boomsServers') in index.js.
// If it is omitted, it will be set as './boomsServers'.
// It should be started with "."
const saveToFolder = './boomsServers';

// The timer for redoing fetch (unit is seconds).
// If it is omitted, Booms will does fetch only once.
// When the remote services change frequently, use it.
const timer = 10;

require('../../src').client.fetchServers(serverNames, saveToFolder, options, timer);
