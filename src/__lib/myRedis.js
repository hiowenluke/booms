
const Redis = require('ioredis');

/** @name lib.myRedis */
const me = {
	prefix: 'rpc_booms_',
	names: 'servers_names',

	init(config) {
		this.redis = new Redis(config);
		return this.redis;
	},

	async getAllServerNames() {
		const string = await this.get(this.names);
		return string ? string.split(',') : [];
	},

	async saveServerName(name) {
		const arr = await this.getAllServerNames();
		arr.push(name);

		const uniqueArr = Array.from(new Set(arr));
		await this.set(this.names, uniqueArr.join(','));
	},

	async saveServerDataJson(name, data) {
		if (typeof data === 'object') {
			data.name = name;
			data = JSON.stringify(data);
		}
		await this.set(name, data);
	},

	async getServerData(name) {
		const string = await this.get(name);
		return JSON.parse(string);
	},

	async saveServerData(name, data) {
		await this.saveServerName(name);
		await this.saveServerDataJson(name, data);
	},

	async set(key, value) {
		await this.redis.set(this.prefix + '#' + key, value);
	},

	async get(key) {
		return await this.redis.get(this.prefix + '#' + key);
	},

	disconnect() {
		this.redis.disconnect();
	}
};

module.exports = me;
