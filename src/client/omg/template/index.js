
const call = require('./booms/call');
const data = require('./data');

let isInitialized;

const attachCallFunction = (serverName, host, port, obj, path = '') => {
	Object.keys(obj).forEach(key => {
		const node = obj[key];
		const subPath = path + key;

		if (!Object.keys(node).length) {
			obj[key] = (...args) => {
				return call(serverName, host, port, subPath, args);
			};
		}
		else {
			attachCallFunction(serverName, host, port, node, subPath + '.');
		}
	});
};

const init = () => {
	if (isInitialized) return;

	const {servers, apis} = data;
	const names = Object.keys(servers);
	for (let i = 0; i < names.length; i ++) {
		const name = names[i];
		const {host, port} = servers[name];
		const obj = apis[name];
		attachCallFunction(name, host, port, obj);
	}

	isInitialized = true;
};

init();
module.exports = data.apis;
