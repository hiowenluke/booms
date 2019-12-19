
const options = {

	// Specify the server options.
	// It can be omitted if the host is "localhost".
	server: {
		host: 'localhost',
	},

	// Specify the Redis options.
	// It can be omitted if it is the default options (like below) of Redis.
	redis: {
		host: 'localhost',	  // Redis host
		// port: '6379',		   // Redis port
		// password: 'auth',	   // Redis password
		// db: 0,				  // Redis database number
		// family: 4,			  // 4 (IPv4) or 6 (IPv6)
	},
};

// The name of this server.
// If it is omitted, it will be "s1".
const serverName = 's2';

// The name of the folder which will be loaded.
// It can be omitted if it is "./src".
// It should be started with "."
const folderName = './src';

require('../../src').server.init(serverName, folderName, options);
