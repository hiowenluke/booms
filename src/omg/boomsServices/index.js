
const call = require('./booms/call');
const data = require('./data');

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

	const {infos, apis} = data;
	const names = Object.keys(infos);
	for (let i = 0; i < names.length; i ++) {
		const name = names[i];
		const {host, port} = infos[name];
		const obj = apis[name];
		attachCallFunction(name, host, port, obj);
	}

	isInitialized = true;
};

init();
module.exports = data.apis;
