
const call = require('./lib/doomsCall');

const main = async () => {
	let result;

	result = await call('s1:/about');
	console.log(result); // "Microservices #1"

	result = await call('s2:/about');
	console.log(result); // "Microservices #2"

	result = await call('s1:/say/hi', 'owen', 100);
	console.log(result); // { msg: 'Hi, I\'m owen, 100 years old.' }
};

main();
