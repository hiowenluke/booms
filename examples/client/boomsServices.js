
const servers = {
    "s1": {
        "host": "localhost",
        "port": 50051
    },
    "s2": {
        "host": "localhost",
        "port": 50052
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
