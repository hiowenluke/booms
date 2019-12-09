
const services = require('./lib/doomsClient');

const main = async () => {
	const {s1, s2} = await services('s1', 's2');

	let result;
	result = await s1.about();
	console.log(result); // "Microservices #1"

	result = await s2.about();
	console.log(result); // "Microservices #2"

	result = await s1.say.hi('owen', 100);
	console.log(result); // { msg: 'Hi, I\'m owen, 100 years old.' }
};

main();
