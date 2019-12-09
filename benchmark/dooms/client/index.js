
const be = require('benchmark-easy')();
const services = require('./lib/doomsClient');

const main = async () => {
	const {sb} = await services();
	const result = await sb.test();
	// console.log(result);
};

// module.exports = main;
be.start(main, 10000);
