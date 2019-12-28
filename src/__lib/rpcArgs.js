
const me = {
	UNDEFINED: '__undefined__',
	FUNCTION: '__function__',

	encode(args) {
		return args.map(item => item === undefined ? this.UNDEFINED : typeof item === 'function' ? this.FUNCTION : item);
	},

	decode(args) {
		return args.map(item => item === this.UNDEFINED ? undefined : item);
	}
};

module.exports = me;
