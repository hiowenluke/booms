
const be = require('benchmark-easy')();
const services = require('./lib/doomsClient');

let sb;

const main = async () => {
	const result = await sb.test();
	// console.log(result);
};

// module.exports = main;

(async () => {
	sb = (await services()).sb;
	be.start(main, 10000);
})();
