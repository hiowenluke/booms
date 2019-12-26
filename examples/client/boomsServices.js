
const servers = {
    "s1": {
        "host": "localhost",
        "port": 30001
    },
    "s2": {
        "host": "localhost",
        "port": 30002
    }
};

const apis = {
    "s1": {
        "about": {},
        "say": {
            "hi": {}
        }
    },
    "s2": {
        "about": {}
    }
};

module.exports = {servers, apis};
