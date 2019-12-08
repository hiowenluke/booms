
const options = {

	// Specify the gRPC options.
	// It can be omitted if the host is "localhost".
	gRPC: {
		host: 'localhost',      // gRPC host
	},

	// Specify the Redis options.
	// It can be omitted if it is the default options (like below) of Redis.
	redis: {
		host: 'localhost',      // Redis host
		// port: '6379',           // Redis port
		// password: 'auth',       // Redis password
		// db: 0,                  // Redis database number
		// family: 4,              // 4 (IPv4) or 6 (IPv6)
	},
};

// "s2"
// 		The name of this microservice.
// 		It can be omitted if you have only one microservice.

// "./src"
// 		The root folder name of business files such as "src/say/hi.js".
// 		It can be omitted or replaced with other names such as "./biz", "./lib", etc.
// 		It should be started with ".".

require('../../src').initServer('s2', './src', options);
