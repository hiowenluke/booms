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

// The list of the remote functions with parameters. 
// You should use the "await" keyword to call them.		
const apis = {
    s1: {
        about(){},
        callback(hi, cb){},
        obj: {
            do(){}
        },
        say: {
            hi(name, age){}
        }
    },
    s2: {
        about(){}
    }
};

module.exports = apis; (() => {module.exports = require('.').client.fetchServices(module.parent.filename)})();
