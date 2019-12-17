
const options = {

	// Specify the gRPC options.
	// It can be omitted if the host is "localhost".
	gRPC: {
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

// The name of this microservice.
// If it is omitted, it will be set as "s1".
const serviceName = 's1';

// The name of the folder which will be loaded.
// It can be omitted if it is "./src".
// It should be started with "."
const folderName = './src';

require('../../src').initService(serviceName, folderName, options);
