
const call = require('./booms/call');
const definitions = require('./definitions');

let isInitialized;

const attachCallFunction = (serviceName, host, port, obj, path = '') => {
	Object.keys(obj).forEach(key => {
		const node = obj[key];
		const subPath = path + key;

		if (!Object.keys(node).length) {
			obj[key] = (...args) => {
				return call(serviceName, host, port, subPath, args);
			};
		}
		else {
			attachCallFunction(serviceName, host, port, node, subPath + '.');
		}
	});
};

const init = () => {
	if (isInitialized) return;

	const {services, apis} = definitions;
	const names = Object.keys(services);
	for (let i = 0; i < names.length; i ++) {
		const name = names[i];
		const {host, port} = services[name];
		const obj = apis[name];
		attachCallFunction(name, host, port, obj);
	}

	isInitialized = true;
};

init();
module.exports = definitions.apis;
