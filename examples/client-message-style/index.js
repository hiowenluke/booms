
const call = require('./boomsCall');

const main = async function () {
	let result;

	result = await call('s1:/about');
	console.log(result); // "Server #1"

	result = await call('s2:/about');
	console.log(result); // "Server #2"

	result = await call('s1:/say/hi', 'owen', 100);
	console.log(result); // { msg: 'Hi, I am owen, 100 years old.' }
};

main();
