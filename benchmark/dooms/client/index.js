
const services = require('./lib/doomsClient');

const main = async () => {
	const {sb} = await services();
	const result = await sb.test();
	// console.log(result);
};

module.exports = main;
