
const {s1, s2} = require('../../services');

const main = async function () {
	let result;

	result = await s1.about();
	console.log(result); // "Server #1"

	result = await s2.about();
	console.log(result); // "Server #2"

	result = await s1.say.hi('owen', 100);
	console.log(result); // { msg: 'Hi, I am owen, 100 years old.' }

	const x = 1;
	result = await s1.callback('hi', function (y) {
		// The argument y is passed from the server, its value is 2
		return x + y;
	});
	console.log(result); // "hi, 3"
};

main();
