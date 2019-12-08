
const myRedis = require('./__lib/myRedis');
const config = require('./config');

/** @name me.server */
const me = {
	async init(caller, ...args) {
		try {
			const {doomsConfig, grpcConfig, redisConfig} = config.getAllConfigurations(args);
			myRedis.init(redisConfig);

			const grpcArgs = [doomsConfig.name, doomsConfig.folder, grpcConfig];
			const {name, keyPaths} = await this.initGRPC(caller, ...grpcArgs);

			await myRedis.saveService(name, keyPaths.join(','));
		}
		catch(e) {
			console.log(e);
		}
	},

	async initGRPC(caller, ...args) {
		try {
			const {doomsConfig, grpcConfig} = lib.argOptions(args, config);

			const projectPath = path.resolve(caller, '..');
			const sourcePath = path.resolve(projectPath, doomsConfig.folder);

			// Require the source path as an object
			const source = kdo(sourcePath);

			// Get key paths of the source object, such as:
			// 		[
			// 			"/about",
			// 			"/do/somethingIsWrong",
			// 			"/say/hi",
			// 		]
			const keyPaths = lib.keyPaths.toPaths(source);

			// Apply the name of this microservice if needed
			const prefix = doomsConfig.name ? doomsConfig.name + ':' : '';

			// Init rpc
			const rpc = RPC(grpcConfig);

			// Create listeners for each keyPath
			keyPaths.forEach(async keyPath => {
				const filePath = sourcePath + keyPath + '.js';
				if (fs.existsSync(filePath)) {
					const queue = prefix + keyPath;
					const handler = require(filePath);

					// Function only
					if (typeof handler === 'function') {

						// Call handler via rpc, cool!
						await rpc.listen(config.queuePrefix + queue, handler);
					}
				}
			});

			console.log(`Service ${doomsConfig.name} is running...`);
			return {name: doomsConfig.name, keyPaths};
		}
		catch(e) {
			console.log(e);
		}
	}
};

module.exports = me;
