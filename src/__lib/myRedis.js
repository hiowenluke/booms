
const Redis = require('ioredis');

/** @name lib.myRedis */
const me = {
	prefix: '', // "rpc_dooms_"
	names: '', // "rpc_dooms_#services_names"

	init(config, prefix) {
		this.redis = new Redis(config);

		this.prefix = prefix;
		this.names = this.prefix + '#services_names';
	},

	async isServiceNameExists(name) {
		const names = await this.getAllServiceNames();
		return names.indexOf(name) >= 0;
	},

	async getAllServiceNames() {
		const string = await this.redis.get(this.names);
		return string ? string.split(',') : [];
	},

	async saveServiceName(name) {
		const arr = await this.getAllServiceNames();
		arr.push(name);

		const uniqueArr = Array.from(new Set(arr));
		await this.redis.set(this.names, uniqueArr.join(','));
	},

	async saveServiceDataJson(name, data) {
		if (typeof data === 'object') {
			data.name = name;
			data = JSON.stringify(data);
		}
		await this.redis.set(this.prefix + name, data);
	},

	async getServiceData(name) {
		const string = await this.redis.get(this.prefix + name);
		return JSON.parse(string);
	},

	async saveServiceData(name, data) {
		await this.saveServiceName(name);
		await this.saveServiceDataJson(name, data);
	}
};

module.exports = me;
