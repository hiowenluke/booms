
const UNDEFINED = '__undefined__';

const me = {
	encode(args) {
		return args.map(item => item === undefined ? UNDEFINED : item);
	},

	decode(args) {
		return args.map(item => item === UNDEFINED ? undefined : item);
	}
};

module.exports = me;
