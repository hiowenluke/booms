
const me = {
	encode(args) {
		return args.map(item => item === undefined ? '__undefined__' : item);
	},

	decode(argsStr) {
		return argsStr.replace(/__undefined__/g, undefined);
	}
};

module.exports = me;
