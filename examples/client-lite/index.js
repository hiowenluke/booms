
const services = require('./lib/boomsClient');

const main = async () => {
	const {s1, s2} = await services();

	let result;
	result = await s1.about();
	console.log(result); // "Microservices #1"

	result = await s2.about();
	console.log(result); // "Microservices #2"

	result = await s1.say.hi('owen', 100);
	console.log(result); // { msg: 'Hi, I am owen, 100 years old.' }
};

main();
