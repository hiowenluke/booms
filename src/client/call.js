
const net = require('net');

const config = require('../config');
const myRedis = require('../__lib/myRedis');
const proxy = require('./proxy');

let isInitialized;
let isServicesFetched;

const attachCallFunction = (client, serverName, apis) => {
	const obj = {};

	apis.forEach(api => {
		obj[api] = (...args) => {
			return proxy(client, serverName, api, args);
		};
	});

	return obj;
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

			const client = new net.Socket();
			client.connect(port, host);

			const obj = attachCallFunction(client, name, apis);
			this.servers[name] = obj;
		}

		myRedis.disconnect();
	},

	async get(apiPath, ...serverNames) {
		try {
			if (!isServicesFetched) {
				isServicesFetched = 1;
				await this.fetchServers();
			}

			const [serverName, api] = apiPath.split(':');
			const server = this.servers[serverName];

			const apiX = (() => {
				if (api.indexOf('/') >= 0) {
					return api.replace(/^\//, '').replace(/\//g, '.');
				}
				else {
					return api;
				}
			})();

			const result = await server[apiX](...serverNames);
			return result;
		}
		catch(e) {
			console.log(e);
		}
	}
};

module.exports = me;
