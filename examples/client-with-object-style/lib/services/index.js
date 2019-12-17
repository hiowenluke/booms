
const call = require('./booms/call');

const me = {
	"s1": {
		"about": (...args) => {
			const name = 's1';
			const host = 'localhost';
			const port = 50051;
			const subPath = 'about';

			return call(name, host, port, subPath, args);
		}
	}
};

module.exports = me;
