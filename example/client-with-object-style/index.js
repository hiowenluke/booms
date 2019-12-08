
const services = require('./lib/doomsServices');

const main = async () => {

	// Get services by names 's1', 's2'.
	// If the names are omitted, all services will be returned
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
