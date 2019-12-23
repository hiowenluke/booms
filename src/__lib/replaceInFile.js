
const fs = require('fs');

const fn = (filePath, target, replacer) => {
	if (typeof replacer === 'object') {
		replacer = JSON.stringify(replacer, null, 4);
	}

	const content = fs.readFileSync(filePath, 'utf-8');
	const newContent = content.replace(target, replacer);
	fs.writeFileSync(filePath, newContent, 'utf-8');
};

module.exports = fn;
