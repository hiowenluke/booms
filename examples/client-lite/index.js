
const services = require('./boomsServices');

const main = async () => {
	const {s1, s2} = await services();

	let result;
	result = await s1.about();
	console.log(result); // "Server #1"

	result = await s2.about();
	console.log(result); // "Server #2"

	result = await s1.say.hi('owen', 100);
	console.log(result); // { msg: 'Hi, I am owen, 100 years old.' }
};

main();
