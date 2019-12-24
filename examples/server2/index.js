
const booms = require('../..');

// The name of this server.
// If it is omitted, it will be "s1".
const name = 's2';

// The directory which will be loaded.
// It can be omitted if it is "./src".
// It should be started with "."
const dir = './src';

// The address of this server host.
// It can be omitted if it is "localhost".
const host = 'localhost';

const options = {

	// The options of redis server.
	// It can be omitted if it is the default options like below.
	redis: {
		host: 'localhost',	  		// Redis host
		// port: '6379',		   	// Redis port
		// password: 'auth',	   	// Redis password
		// db: 0,				  	// Redis database number
		// family: 4,			  	// 4 (IPv4) or 6 (IPv6)
	}
};

// The number and order of the parameters can be arbitrary.
booms.server.init(name, dir, host, options);

// It is equivalents to:
// 		const options = {
// 			name: 's2',
// 			dir: './src',
// 			host: 'localhost',

// 			redis: {
// 				host: 'localhost',
// 			}
// 		};

// 		booms.server.init(options);
