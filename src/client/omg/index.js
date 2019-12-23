
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const fx = require('fs-extra');
const keyPaths = require('keypaths');

const replaceInFile = require('../../__lib/replaceInFile');
const omgConfig = require('./config');

let isInitialized;

const copyFilesToTemp = () => {
	const destFolderPath = path.resolve(__dirname, omgConfig.tempPath);
	if (!fs.existsSync(destFolderPath)) {
		fs.mkdirSync(destFolderPath);
	}

	const sourceFolderPath = path.resolve(__dirname, omgConfig.boomsServicesPath);
	fx.copySync(sourceFolderPath, destFolderPath);
};

const getClientRoot = (parentFilename) => {
	const seekFile = (parentFolder, filename) => {
		let p = parentFolder;

		while (p !== '/') {
			const dest = p + '/' + filename;
			if (fs.existsSync(dest)) {
				return dest;
			}
			p = path.resolve(p, '..');
		}
	};

	const parentFolder = path.resolve(parentFilename, '..');
	const userConfigFile = seekFile(parentFolder, 'boomsConfig.js') || seekFile(parentFolder, '.boomsConfig.js');
	const userRoot = path.resolve(userConfigFile, '..');

	return userRoot;
};

const getUserConfig = (clientRoot) => {
	const filenames = ['boomsConfig.js', '.boomsConfig.js'];
	const filename = filenames.find(filename => fs.existsSync(clientRoot + '/' + filename));
	if (!filename) {
		throw new Error(`Can not find boomsConfig.js in current project root path`);
	}

	return require(clientRoot + '/' + filename);
};

const getRawServersInfos = (userConfig) => {
	const cmdFilePath = path.resolve(__dirname, './createRawServersInfos.js');
	cp.execSync(`node ${cmdFilePath} '${JSON.stringify(userConfig)}'`);

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

const parseServersInfosFromRaw = (rawInfos) => {

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

const writeToDataFile = (clientRoot, infos, apis) => {

	// For Booms client running
	const filePath = path.resolve(__dirname, omgConfig.tempPath + '/data.js');
	replaceInFile(filePath, '`{serversInfos}`', infos);
	replaceInFile(filePath, '`{servicesApis}`', apis);

	// For user to view all apis information.
	const sourceFile = filePath;
	const targetFile = clientRoot + '/boomsServices.js';
	fs.copyFileSync(sourceFile, targetFile);
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
		const serversInfos = parseServersInfosFromRaw(rawServersInfos);
		
		writeToDataFile(clientRoot, serversInfos, servicesApis);
	}
};

module.exports = me;
