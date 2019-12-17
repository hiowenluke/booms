
const caller = require('caller');
const service = require('./service');
const client = require('./client');
const rpc = require('./rpc');
const omg = require('./omg');

const me = {
	async initService(...args) {
		const pathToCaller = caller();
		return await service.init(pathToCaller, ...args);
	},

	initClient(...args) {
		return client.init(...args);
	},

	initRpc(...args) {
		return rpc.init(...args);
	},

	async omg(...args) {
		const pathToCaller = caller();
		return await omg.do(pathToCaller, ...args);
	}
};

module.exports = me;
