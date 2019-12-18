
// This options can be omitted if options.redis.host is 'localhost'
const options = {
	redis: {
		host: 'localhost',
	}
};

// The names of the remote services which will be fetched.
// If it is omitted, Booms will fetch all remote services definitions.
const servicesNames = ['s1', 's2'];

// The folder where the remote services definitions will be stored.
// If it is omitted, it will be set as './boomsServices'.
// It must be same as require('./boomsServices') in index.js.
const folderName = './boomsServices';

// The timer for redoing fetch (unit is seconds).
// If it is omitted, Booms will does fetch only once.
// When the remote services change frequently, use it.
const timer = 10;

require('../../src').fetchServices(servicesNames, folderName, options, timer);
