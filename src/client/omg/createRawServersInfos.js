
const fs = require('fs');
const path = require('path');

const myRedis = require('../../__lib/myRedis');
const omgConfig = require('./config');

let userConfig = {};

const getRawServersInfos = async () => {
	myRedis.init(userConfig.redis);

	let serversNames = userConfig.servers;

	if (!serversNames || !serversNames.length || serversNames === 'all') {
		serversNames = await myRedis.getAllServerNames();
	}
	else if (typeof serversNames === 'string') {
		serversNames = [serversNames];
	}

	const infos = {};

	for (let i = 0; i < serversNames.length; i ++) {
		const serverName = serversNames[i];
		const info = await myRedis.getServerData(serverName);
		infos[serverName] = info;
	}

	myRedis.disconnect();
	return infos;
};

const writeToFile = (infos) => {
	const filePath = path.resolve(__dirname, omgConfig.tempPath + '/rawServersInfos.js');
	const content = 'module.exports = ' + JSON.stringify(infos, null, 4);
	fs.writeFileSync(filePath, content, 'utf-8');
};

const fn = async () => {
	const userConfigJsonStr = process.argv[2];
	userConfig = JSON.parse(userConfigJsonStr);

	const rawServersInfos = await getRawServersInfos();
	writeToFile(rawServersInfos);
};

fn();
