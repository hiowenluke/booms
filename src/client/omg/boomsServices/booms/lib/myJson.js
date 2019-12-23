
const UNDEFINED = '__undefined__';

/** @name lib.myJson */
const me = {
	stringify(result) {
		const type = typeof result;
		const invalidTypes = ['function', 'date'];

		if (type === 'undefined') {
			result = UNDEFINED;
		}
		else
		if (invalidTypes.indexOf(type) >= 0) {
			result = "{}";
		}
		else {
			result = JSON.stringify(result);
		}

		return result;
	},

	parse(message) {
		if (message === UNDEFINED) {
			return undefined;
		}
		else {
			return !message ? [] : JSON.parse(message);
		}
	},

	parseMessage(message) {
		const pos = message.indexOf('#');
		const funcName = message.substr(0, pos);
		const argsStr = message.substr(pos + 1);
		const args = this.parse(argsStr);
		return [funcName, args];
	}
};

module.exports = me;
