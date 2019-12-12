
const options = {

	// Specify the gRPC options.
	// It can be omitted if the host is "localhost".
	gRPC: {
		host: 'localhost',	  // gRPC host
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

// "s1"
//		The name of this microservice.
//		The default value is "s1".

// "./src"
//		The root folder name of business function files.
//		The default value is "./src"
//		It should be started with ".".

require('../../src').initService('s1', './src', options);
