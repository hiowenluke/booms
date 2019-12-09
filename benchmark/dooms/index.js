
const be = require('benchmark-easy')();
const exec = require('child_process').exec;
const client = require('./client');

const wait = async (ms = 1000) => {
	return new Promise(resolve => {
		setTimeout(() => resolve, ms);
	});
};

const main = async () => {
	exec('node ./service/index.js');
	await wait();

	be.start(client, 10);
};

main();
