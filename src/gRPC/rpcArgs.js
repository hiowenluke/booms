
const me = {
	encode(args) {
		return args.map(item => item === undefined ? '__undefined__' : item);
	},

	decode(args) {
		return args.map(item => item === '__undefined__' ? undefined : item);
	}
};

module.exports = me;
