
const fn = async function(hi, cb) {

	// Note that the callback has wrapped as an asynchronous function
	const cbResult = await cb(2);

	return hi + ', ' + cbResult;
};

module.exports = fn;
