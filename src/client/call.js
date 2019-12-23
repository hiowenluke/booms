
const Socket = require('./lib/Socket');
const proxy = require('./lib/proxy');
const config = require('../__config');
const myRedis = require('../__lib/myRedis');

let isInitialized;
let isServersFetched;

const attachCallFunction = (client, serverName, apis) => {
	const obj = {};

	apis.forEach(api => {
		obj[api] = (...args) => {
			return proxy(client, serverName, api, args);
		};
	});

	return obj;
};

const fetchServers = {
	names: [],
	infos: {},
	servers: {},

	async init() {
		const names = await myRedis.getAllServerNames();
		const infos = {};

		for (let i = 0; i < names.length; i ++) {
			const name = names[i];
			const info = await myRedis.getServerData(name);
			infos[name] = info;
		}

		myRedis.disconnect();

		this.names = names;
		this.infos = infos;
	},

	do(serverName) {
		let server = this.servers[serverName];
		if (!server) {
			const {host, port, apis} = this.infos[serverName];

			const client = Socket.new(serverName, host, port);
			server = attachCallFunction(client, serverName, apis);

			this.servers[serverName] = server;
		}
		return server;
	}
};

const me = {
	init(...args) {
		if (!isInitialized) {
			isInitialized = 1;

			const {redisConfig} = config.getAllConfigurations(args);
			myRedis.init(redisConfig);
		}

		return this.get;
	},

	async get(apiPath, ...args) {
		try {
			let [serverName, api] = apiPath.split(':');

			if (api.indexOf('/') >= 0) {
				api = api.replace(/^\//, '').replace(/\//g, '.');
			}

			if (!isServersFetched) {
				isServersFetched = 1;
				await fetchServers.init();
			}

			const server = fetchServers.do(serverName);
			if (!server[api]) {
				throw new Error(`The api "/${api}" is not found on server ${serverName}`);
			}

			const result = await server[api](...args);
			return result;
		}
		catch(e) {
			console.log(e);
		}
	}
};

module.exports = me;
