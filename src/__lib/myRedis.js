
const Redis = require('ioredis');

/** @name lib.myRedis */
const me = {
	prefix: 'rpc_booms_',
	names: 'services_names',

	init(config) {
		this.redis = new Redis(config);
		return this.redis;
	},

	async getAllServiceNames() {
		const string = await this.get(this.names);
		return string ? string.split(',') : [];
	},

	async saveServiceName(name) {
		const arr = await this.getAllServiceNames();
		arr.push(name);

		const uniqueArr = Array.from(new Set(arr));
		await this.set(this.names, uniqueArr.join(','));
	},

	async saveServiceDataJson(name, data) {
		if (typeof data === 'object') {
			data.name = name;
			data = JSON.stringify(data);
		}
		await this.set(name, data);
	},

	async getServiceData(name) {
		const string = await this.get(name);
		return JSON.parse(string);
	},

	async saveServiceData(name, data) {
		await this.saveServiceName(name);
		await this.saveServiceDataJson(name, data);
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
