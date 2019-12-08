
// Corresponds to message: "/say/hi"

const fn = async (name, age) => {
	return {msg: `Hi, I'm ${name}, ${age} years old.`};
};

module.exports = fn;
