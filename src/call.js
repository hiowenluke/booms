
const RPC = require('grpc');
const config = require('./config');

let rpc;
let isInitialized;

/** @name me.client */
const me = {
	init(options = {}) {
		if (!isInitialized) {
			isInitialized = 1;

			rpc = RPC(options.gRPC);
		}
		return this.call;
	},

	async call(queue, ...args) {
		try {
			return await rpc.call(config.queuePrefix + queue, ...args);
		}
		catch(e) {
			console.log(e);
		}
	}
};

module.exports = me;
