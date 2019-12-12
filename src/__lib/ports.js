
const me = {
	key: 'ports',
	startingPort: 50051,
	redis: null,

	init(redis) {
		this.redis = redis;
	},

	async calc(serviceName) {
		const {key, startingPort, redis} = this;

		const str = await redis.get(key); // `[{"name": "s1", "value": "50051"}, {"name": "s2", "value": "50052"}, ...]`
		const arr = str ? JSON.parse(str) : [];

		// Find the port definition of this service
		const portDef = arr.find(item => item.name === serviceName);
		let port;

		// The port is exists, reuse it
		if (portDef) {
			port = portDef.value - 0;
		}
		else {
			// It is the first service
			if (!arr.length) {
				port = startingPort;
			}
			else {
				// Plus 1 to maxPort
				const maxPort = Math.max.apply(Math, arr.map(o => o.value - 0));
				port = maxPort + 1;
			}
		}

		// Save to redis
		arr.push({name: serviceName, value: port});
		const value = JSON.stringify(arr);
		await redis.set(key, value);

		return port;
	}
};

module.exports = me;
