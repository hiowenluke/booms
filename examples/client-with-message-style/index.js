
const rpc = require('./lib/boomsRpc');

const main = async () => {
	let result;

	result = await rpc('s1:/about');
	console.log(result); // "Microservices #1"

	result = await rpc('s2:/about');
	console.log(result); // "Microservices #2"

	result = await rpc('s1:/say/hi', 'owen', 100);
	console.log(result); // { msg: 'Hi, I am owen, 100 years old.' }
};

main();
