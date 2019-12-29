
const fn = (str) => { // "(a, b = '', c) => {}"
	const temp = str.match(/\((.*?)\)/); // "a, b = '', c"
	if (!temp) return null;

	const params = temp[1].split(','); // ['a', " b = ''", ' c']
	const names = params.map(item => item.replace(/(^\s*?(?=\b))|(\s*?$)/g, '').split('=')[0]); // ['a', 'b', 'c']

	return names;
};

module.exports = fn;
