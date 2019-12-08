
const Redis = require('ioredis');

const me = {
	prefix: 'rpc_dooms_',
	names: 'rpc_dooms_#services_names',

	init(config) {
		this.redis = new Redis(config);
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
		await this.redis.set(this.names, arr.join(','));
	},

	async saveServiceData(name, data) {
		await this.redis.set(this.prefix + name, data);
	},

	async getServiceData(name) {
		return await this.redis.get(this.prefix + name);
	},

	async saveService(name, data) {
		await this.saveServiceName(name);
		await this.saveServiceData(name, data);
	}
};

module.exports = me;
