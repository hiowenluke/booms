
const fn = async function(hi, cb) {

	// The cb is the callback comes from the client.
	// The cb has wrapped as an asynchronous function by Booms automatically.
	// You should use keyword await when invoke it.

	// The cbResult is the result returned after the cb is executed.
	const cbResult = await cb(2);

	return hi + ', ' + cbResult;
};

module.exports = fn;
