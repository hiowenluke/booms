
const spawn = require('child_process').spawn;
const test = require('./test');

const wait = (ms = 1000) => {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	})
};

describe('Booms', () => {

	const cps = [];

	before(async () => {
		cps.push(spawn('node', ['../examples/server1']));
		cps.push(spawn('node', ['../examples/server2']));

		// Waiting for all services are ready
		await wait();
	});

	after(() => {
		try {
			cps.forEach(cp => {
				process.kill(cp.pid, 'SIGTERM');
			});
		}
		catch(e) {}
	});

	it('object style', async () => {
		await test('../examples/client/index');
	});

	it('message style', async () => {
		await test('../examples/client-message-style/index');
	});
});
