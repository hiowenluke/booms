
const caller = require('caller');
const service = require('./service');
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

	async initClient(...args) {
		const pathToCaller = caller();
		return await omg.do(pathToCaller, ...args);
	}
};

module.exports = me;
