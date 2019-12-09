/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var PROTO_PATH = __dirname + '/helloworld.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;
var client = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());

async function sayHello (username = 'world') {
    return new Promise(resolve => {
        client.sayHello({name: username}, function(err, response) {
            resolve('Greeting: ' + response.message);
        });
    })
}

async function main() {
    const result = await sayHello();
    // console.log(result);
}

const be = require('benchmark-easy')();
be.start(main, 10000);
