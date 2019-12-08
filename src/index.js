
const me = require('kdo')();
const caller = require('caller');

const main = {
	async initServer(...args) {
		const pathToCaller = caller();
		await me.server.init(pathToCaller, ...args);
	},

	initCall(...args) {
		return me.call.init(...args);
	},

	initServices(...args) {
		return me.services.init(...args);
	}
};

module.exports = main;
