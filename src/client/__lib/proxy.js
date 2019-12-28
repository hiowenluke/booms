
const myJson = require('../../__lib/myJson');
const rpcArgs = require('../../__lib/rpcArgs');

const fetchCallbacks = (args) => {
	const callbacks = [];

	args.forEach((arg, index) => {
		if (typeof arg === 'function') {
			callbacks[index] = arg;
		}
	});

	return callbacks;
};

const getFinalResult = (client, cbResultStr) => {
	return new Promise(resolve => {
		client.once('data', data => {
			const message = data.toString();
			const result = myJson.parse(message);
			resolve(result);
		});

		client.write('booms_callback_result#' + cbResultStr);
	});
};

const fn = (client, serverName, api, args) => {
	return new Promise(resolve => {

		// Save callback functions
		const callbacks = fetchCallbacks(args);

		args = rpcArgs.encode(args);

		client.once('data', async data => {
			if (!data) {
				throw new Error(`Server ${serverName} is not available. Is it running?`);
			}

			const message = data.toString();

			// The server tells the client to perform the callback function
			// `booms_callback_do_2#["abc",123]` => args[2]("abc", 123)
			if (message.substr(0, 17) === 'booms_callback_do') {
				const [funcName, args] = myJson.parseMessage(message);
				const index = funcName.match(/\d+/)[0];
				const fn = callbacks[index];

				const argsOk = rpcArgs.decode(args);
				const cbResult = await fn(...argsOk);
				const cbResultStr = myJson.stringify(cbResult);

				// Redo client.once() to get the final result
				const result = await getFinalResult(client, cbResultStr);

				resolve(result);
			}
			else {
				const result = myJson.parse(message);
				resolve(result);
			}
		});

		const argsStr = myJson.stringify(args);
		client.write(api + '#' + argsStr);
	})
};

module.exports = fn;
