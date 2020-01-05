
const me = {
	server: {
		name: 's1', // Server name
		dir: './src',
		host: 'localhost',
		basePort: 30201, // The starting port number
	},

	redis: {
		host: 'localhost',
	},

	client: {
		servers: 'all',
		yesBoomsServicesFile: false,

		functionList: {

			// If it is true, the function list in file "zooms/services.js" will be compact like below right.
			// You should to always use "await" keyword to call these functions.
			// 		s1: {										s1: {
			//			hi: async function(name, age) {}	=> 		hi(name, age) {}
			// 		}											}
			isCompact: false,

			// The useArrowFunction is true only takes effect when isCompact is false
			useArrowFunction: true,
		},
	},
};

module.exports = me;
