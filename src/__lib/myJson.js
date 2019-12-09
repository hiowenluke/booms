
/** @name lib.myJson */
const me = {
	UNDEFINED: '__undefined__',

	stringify(result) {
		const type = typeof result;
		const invalidTypes = ['function', 'date'];

		if (type === 'undefined') {
			result = this.UNDEFINED;
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
		if (message === this.UNDEFINED) {
			return undefined;
		}
		else {
			return JSON.parse(message);
		}
	}
};

module.exports = me;
