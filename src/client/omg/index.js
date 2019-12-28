
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const fx = require('fs-extra');
const keyPaths = require('keypaths');

const config = require('../../__config');
const omgConfig = require('./config');
const replaceInFile = require('../../__lib/replaceInFile');

let isInitialized;

const copyFilesToTemp = () => {
	const destPath = path.resolve(__dirname, omgConfig.tempPath);
	const destBoomsPath = destPath + '/booms';

	fx.removeSync(destPath);
	fs.mkdirSync(destPath);

	const sourcePath = path.resolve(__dirname, omgConfig.boomsServicesPath);
	fx.copySync(sourcePath, destPath);

	const copyBoomsFiles = () => {
		const destBoomsLibPath = destBoomsPath + '/lib';
		fx.mkdirSync(destBoomsLibPath);

		const filenames = [
			['../../__lib/myJson.js', '/lib/myJson.js'],
			['../../__lib/rpcArgs.js', '/lib/rpcArgs.js'],
			['../__lib/proxy.js', '/proxy.js'],
			['../__lib/Socket.js', '/Socket.js'],
		];

		filenames.forEach(filenames => {
			const [from, to] = filenames;
			const sourceFilePath = path.resolve(__dirname, from);
			const destFilePath = destBoomsPath + to;
			fs.copyFileSync(sourceFilePath, destFilePath);
		});
	};

	copyBoomsFiles();

	const modifyRequirePath = () => {
		const file = destBoomsPath + '/proxy.js';
		const content = fs.readFileSync(file, 'utf-8');
		const newContent = content.replace(/\.\.\/\.\.\/__lib/g, './lib');
		fs.writeFileSync(file, newContent, 'utf-8');
	};

	modifyRequirePath();
};

const getClientRoot = (startingFilename) => {
	const seekFile = (startingDir, filename, cb) => {
		let p = startingDir;

		while (p !== '/') {
			const dest = p + '/' + filename;
			if (fs.existsSync(dest) && (!cb || cb(dest))) {
				return dest;
			}
			p = path.resolve(p, '..');
		}
	};

	const startingDir = path.resolve(startingFilename, '..');
	const targetFile =
		seekFile(startingDir, 'boomsConfig.js') ||
		seekFile(startingDir, '.boomsConfig.js') ||
		seekFile(startingDir, 'package.json', (filePath) => {
			const pkg = require(filePath);
			return pkg.dependencies.booms;
		})
	;

	if (!targetFile) {
		throw new Error(`Can not find package.json or boomsConfig.js in current project root path`);
	}

	const userRoot = path.resolve(targetFile, '..');
	return userRoot;
};

const getUserConfig = (clientRoot) => {
	const filenames = ['boomsConfig.js', '.boomsConfig.js'];
	const filename = filenames.find(filename => fs.existsSync(clientRoot + '/' + filename));

	let userConfig = {};
	if (filename) {
		userConfig = require(clientRoot + '/' + filename);
	}

	userConfig.servers = userConfig.servers || config.client.servers;
	userConfig.yesBoomsServicesFile = userConfig.yesBoomsServicesFile || config.client.yesBoomsServicesFile;
	userConfig.redis = userConfig.redis || config.redis;

	return userConfig;
};

const getRawServersInfos = (userConfig) => {

	// Execute the command file and pass the raw user config to it
	const cmdFilePath = path.resolve(__dirname, './createRawServersInfos.js');
	cp.execSync(`node ${cmdFilePath} '${JSON.stringify(userConfig)}'`);

	// Get the result from file
	const dataFilePath = path.resolve(__dirname, omgConfig.tempPath + '/rawServersInfos.js');
	const serversInfos = require(dataFilePath);

	return serversInfos;
};

const parseServicesApis = (rawInfos) => {
	const data = {};
	const names = Object.keys(rawInfos);

	for (let i = 0; i < names.length; i ++) {
		const name = names[i];
		const info = rawInfos[name];
		const {apis} = info;
		const obj = keyPaths.toObject(apis);
		data[name] = obj;
	}

	return data;
};

const cropServersInfosFromRaw = (rawInfos) => {

	// Only need host and port of info
	const names = Object.keys(rawInfos);
	const infos = {};

	for (let i = 0; i < names.length; i ++) {
		const name = names[i];
		const info = rawInfos[name];
		const {host, port} = info;
		infos[name] = {host, port};
	}

	return infos;
};

const writeToDataFile = (clientRoot, userConfig, infos, apis) => {

	// For Booms client running
	const filePath = path.resolve(__dirname, omgConfig.tempPath + '/data.js');
	replaceInFile(filePath, '`{serversInfos}`', infos);
	replaceInFile(filePath, '`{servicesApis}`', apis);

	// Create boomsServices.js for user to view all apis information.
	if (userConfig.yesBoomsServicesFile) {
		const sourceFile = filePath;
		const targetFile = clientRoot + '/boomsServices.js';
		fs.copyFileSync(sourceFile, targetFile);
	}
};

const me = {
	do(parentFilename) {
		if (!isInitialized) {
			const clientRoot = getClientRoot(parentFilename);
			const userConfig = getUserConfig(clientRoot);

			copyFilesToTemp();
			this.once(clientRoot, userConfig);

			isInitialized = 1;
		}

		// Now that there is complete data in the temp directory,
		// it is required and returned to the parent module.
		return require(omgConfig.tempPath);
	},

	once(clientRoot, userConfig) {
		const rawServersInfos = getRawServersInfos(userConfig);
		const servicesApis = parseServicesApis(rawServersInfos);
		const serversInfos = cropServersInfosFromRaw(rawServersInfos);

		writeToDataFile(clientRoot, userConfig, serversInfos, servicesApis);
	}
};

module.exports = me;
