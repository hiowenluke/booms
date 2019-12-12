
const fs = require('fs');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const root = __dirname + `/proto_files`;

const pkgDefineOptions = {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true
};

const TEMPLATE = `
	syntax = "proto3";
	package {serviceName};
	
	service Main {
		rpc Proxy (Input) returns (Output) {}
	}
	
	message Input {
		string funcName = 1;
		string argsStr = 2;
	}
	
	message Output {
		string message = 1;
	}
`;

const me = {
	create(serviceName) {
		const content = TEMPLATE.replace('{serviceName}', serviceName);
		const PROTO_PATH = root + `/${serviceName}.proto`;

		if (!fs.existsSync(root)) {
			fs.mkdirSync(root);
		}

		fs.writeFileSync(PROTO_PATH, content, 'utf-8');

		const packageDefinition = protoLoader.loadSync(PROTO_PATH, pkgDefineOptions);
		const proto = grpc.loadPackageDefinition(packageDefinition)[serviceName];

		return proto;
	},
};

module.exports = me;
