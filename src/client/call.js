
const Socket = require('./__lib/Socket');
const proxy = require('./__lib/proxy');
const myRedis = require('../__lib/myRedis');

const parseUserConfig = require('./parseUserConfig');

let isInitialized;
let isDoneFetchServices;

const attachCallFunction = (client, serverName, apis) => {
	const obj = {};

	apis.forEach(api => {
		obj[api] = (...args) => {
			return proxy(client, serverName, api, args);
		};
	});

	return obj;
};

const fetchServices = {
	names: [],
	infos: {},
	apis: {},

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
		let apisObj = this.apis[serverName];
		if (!apisObj) {
			const {host, port, apis} = this.infos[serverName];

			const client = Socket.new(serverName, host, port);
			apisObj = attachCallFunction(client, serverName, apis);

			this.apis[serverName] = apisObj;
		}
		return apisObj;
	}
};

const me = {
	init(...args) {
		if (!isInitialized) {
			isInitialized = 1;

			const {redisConfig} = parseUserConfig(args);
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

			if (!isDoneFetchServices) {
				isDoneFetchServices = 1;
				await fetchServices.init();
			}

			const apisObj = fetchServices.do(serverName);
			if (!apisObj[api]) {
				throw new Error(`The api "/${api}" is not found on server ${serverName}`);
			}

			const result = await apisObj[api](...args);
			return result;
		}
		catch(e) {
			console.log(e);
		}
	}
};

module.exports = me;
