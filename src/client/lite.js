
const keyPaths = require('keypaths');

const Socket = require('./Socket');
const proxy = require('./proxy');
const config = require('../config');
const myRedis = require('../__lib/myRedis');

let isInitialized;
let isServersFetched;

const attachCallFunction = (client, serverName, obj, path = '') => {
	Object.keys(obj).forEach(key => {
		const node = obj[key];
		const subPath = path + key;

		// If it is ending node, replace it with function
		if (!Object.keys(node).length) {
			obj[key] = (...args) => {
				return proxy(client, serverName, subPath, args);
			};
		}
		else {
			// Recursion
			attachCallFunction(client, serverName, node, subPath + '.');
		}
	});
};

const me = {
	servers: {},

	init(...args) {
		if (!isInitialized) {
			isInitialized = 1;

			const {redisConfig} = config.getAllConfigurations(args);
			myRedis.init(redisConfig);
		}

		return this.get.bind(this);
	},

	async fetchServers() {
		const names = await myRedis.getAllServerNames();

		for (let i = 0; i < names.length; i ++) {
			const name = names[i];
			const {host, port, apis} = await myRedis.getServerData(name);
			const obj = keyPaths.toObject(apis);

			const client = Socket.new(name, host, port);
			attachCallFunction(client, name, obj);

			this.servers[name] = obj;
		}

		myRedis.disconnect();
	},

	async get(...serverNames) {
		try {
			if (!isServersFetched) {
				isServersFetched = 1;
				await this.fetchServers();
			}

			if (!serverNames.length) {
				return this.servers;
			}
			else {
				const servers = {};
				for (let i = 0; i < serverNames.length; i ++) {
					const name = serverNames[i];
					const obj = this.servers[name];
					servers[name] = obj;
				}
				return servers;
			}
		}
		catch(e) {
			console.log(e);
		}
	}
};

module.exports = me;
