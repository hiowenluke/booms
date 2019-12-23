
const keyPaths = require('keypaths');

const Socket = require('./lib/Socket');
const proxy = require('./lib/proxy');
const config = require('../__config');
const myRedis = require('../__lib/myRedis');

let isInitialized;
let isDoneFetchServices;

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

const fetchServices = {
	names: [],
	infos: {},
	serversApis: {},

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

	do(serverNames) {
		if (!serverNames.length) {
			serverNames = this.names;
		}

		const serversApis = {};
		for (let i = 0; i < serverNames.length; i ++) {
			const name = serverNames[i];

			let serverApis = this.serversApis[name];
			if (!serverApis) {
				const {host, port, apis} = this.infos[name];
				serverApis = keyPaths.toObject(apis);

				const client = Socket.new(name, host, port);
				attachCallFunction(client, name, serverApis);

				this.serversApis[name] = serverApis;
			}

			serversApis[name] = serverApis;
		}

		return serversApis;
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

	async get(...serverNames) {

		// [["s1", "s2"]] => ["s1", "s2"]
		if (Array.isArray(serverNames[0])) {
			serverNames = serverNames[0];
		}

		try {
			if (!isDoneFetchServices) {
				isDoneFetchServices = 1;
				await fetchServices.init();
			}

			return fetchServices.do(serverNames);
		}
		catch(e) {
			console.log(e);
		}
	}
};

module.exports = me;
