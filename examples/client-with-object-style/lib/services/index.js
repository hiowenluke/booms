
const call = require('./booms/call');
const keyPaths = require('../../../../node_modules/keypaths');
const data = require('./data');

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
	const {infos, apis} = data;
	const names = Object.keys(infos);
	for (let i = 0; i < names.length; i ++) {
		const name = names[i];
		const {host, port} = infos[name];
		const obj = apis[name];
		attachCallFunction(name, host, port, obj);
	}
};

init();
module.exports = data.apis;
