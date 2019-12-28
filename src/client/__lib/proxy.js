
const myJson = require('../../__lib/myJson');
const rpcArgs = require('../../__lib/rpcArgs');

const fn = (client, serverName, api, args) => {
	return new Promise(resolve => {

		// Save callback functions
		const callbacks = [];
		args.forEach((arg, index) => {
			if (typeof arg === 'function') {
				callbacks[index] = arg;
			}
		});

		args = rpcArgs.encode(args);

		// Use "on" instead of "once" for callbacks
		const method = callbacks.length ? 'on' : 'once';
		client[method]('data', async data => {
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
				const result = await fn(...argsOk);

				const resultStr = myJson.stringify(result);
				client.write('booms_callback_result#' + resultStr);
			}
			else {
				// The server send the result to the client
				const result = myJson.parse(message);
				resolve(result);
			}
		});

		const argsStr = myJson.stringify(args);
		client.write(api + '#' + argsStr);
	})
};

module.exports = fn;
