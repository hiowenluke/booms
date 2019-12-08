
const exec = require('child_process').exec;
const test = require('./test');

const wait = async (ms = 1000) => {
	return new Promise(resolve => {
		setTimeout(() => {resolve()}, ms);
	})
};

describe('Dooms', () => {

	before(async () => {
		exec('node ../example/service1');
		exec('node ../example/service2');

		// Waiting for all services are ready
		await wait();
	});

	it('object style', async () => {
		await test('../example/client-with-object-style/index');
	});

	it('message style', async () => {
		await test('../example/client-with-message-style/index');
	});
});
