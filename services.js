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
        about: async function () {},
        callback: async function (hi, cb) {},
        obj: {
            do: async function () {}
        },
        say: {
            hi: async function (name, age) {}
        }
    },
    s2: {
        about: async function () {}
    }
};

module.exports = apis; (() => {module.exports = require('.').client.fetchServices(module.parent.filename)})();
