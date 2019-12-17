
// This options can be omitted if options.redis.host is 'localhost'
const options = {
	redis: {
		host: 'localhost',
	}
};

// The names of the remote services which will be fetched.
// If it is omitted, Booms will fetch all remote services.
const servicesNames = ['s1', 's2'];

// The folder where the remote services data files will be stored.
// If it is omitted, it will be set as './lib/services'.
const folderName = './lib/services';

require('../../src').initClient(servicesNames, folderName, options);
