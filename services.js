const servers = {
    s1: {
        host: "localhost",
        port: 30201
    },
    s2: {
        host: "localhost",
        port: 30202
    }
};

const apis = {
    s1: {
        about: {},
        callback: {},
        obj: {
            do: {}
        },
        say: {
            hi: {}
        }
    },
    s2: {
        about: {}
    }
};

module.exports = apis;                

(() => {
	const parentFilename = module.parent.filename;
	const booms = require('.');
	module.exports = booms.client.fetchServices(parentFilename);
})();
