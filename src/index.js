
const caller = require('caller');
const service = require('./service');
const client = require('./client');
const call = require('./call');
const omg = require('./omg');

const me = {
	async initService(...args) {
		const pathToCaller = caller();
		return await service.init(pathToCaller, ...args);
	},

	initCall(...args) {
		return call.init(...args);
	},

	initClient(...args) {
		return client.init(...args);
	},

	async fetchServices(...args) {
		const pathToCaller = caller();
		return await omg.do(pathToCaller, ...args);
	}
};

module.exports = me;
