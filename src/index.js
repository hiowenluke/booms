
const caller = require('caller');
const server = require('./server');
const client = require('./client');

const me = {
	server: {
		async init(...args) {
			const pathToCaller = caller();
			return await server.init(pathToCaller, ...args);
		},
	},

	client: {
		call(...args) {
			return client.call.init(...args);
		},

		services(...args) {
			return client.lite.init(...args);
		},

		fetchServices(parentFilename) {
			return client.omg.do(parentFilename);
		}
	}
};

module.exports = me;
