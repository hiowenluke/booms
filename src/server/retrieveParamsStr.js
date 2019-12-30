
const REG_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const REG_PARAMS_STR = /\((.*)\)(?=(\s*?{)|(\s*=>\s*?{))/;

const fn = (func) => {
	const body = func.toString() // "(a, b = '', c) => {}"
		.replace(REG_COMMENTS, '')
	;

	const temp = body.match(REG_PARAMS_STR); // "a, b = '', c"
	if (!temp) return '';

	return temp[1];
};

module.exports = fn;
