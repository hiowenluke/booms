
const servers = `{serversInfos}`;

const apis = `{servicesApis}`;

module.exports = apis;

(() => {
	const parentFilename = module.parent.filename;
	const booms = require('.');
	booms.client.fetchServices(parentFilename);
})();
