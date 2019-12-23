
const parentFilename = module.parent.filename;

const booms = require('.');
module.exports = booms.client.fetchServices(parentFilename);
