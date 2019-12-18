
# Booms

A high performance and easy-to-use RPC microservices framework for [Node.js](https://nodejs.org). With Booms, we can load a directory as a service, call the remote functions in it like **s1.say.hi()**, same as we do it with local files. 

Booms is based on [gRPC-node](https://github.com/grpc/grpc-node), but it does not require you to write [proto](https://developers.google.com/protocol-buffers/docs/proto3) files, which is more easier to use.

## Server Environment

1\. [Install Docker](https://docs.docker.com/v17.09/engine/installation/#supported-platforms) (Docker CE recommended)

2\. Install Redis in Docker  
1\) Install: `docker pull redis`  
2\) Start: `docker run --restart=always --name redis -d -p 6379:6379 -it redis redis-server`   

## Install

```sh
npm install booms --save
```

## TRY IT! (in under 5 minutes)

Create a demo folder first.

```sh
mkdir ./booms-demo && cd ./booms-demo
```

### 1. Server

0\) Initialize this server

```sh
mkdir ./server && cd ./server
npm init -y
npm install booms --save
```

1\) Create folders `mkdir -p src/say`, then create "./src/say/hi.js"

```js
module.exports = async (name, age) => {
    return {msg: `Hi, I am ${name}, ${age} years old.`};
};
```

2\) Create "index.js".

```js
require('booms').initService();
```

3\) Run

```sh
node index.js
Service s1 is running on port 50051...
```

### 2. Client

Open a new tab in your terminal first.

0\) Initialize this client

```sh
mkdir ./client && cd ./client
npm init -y
npm install booms --save
```

1\) Create "boomsInit.js".

```js
require('booms').fetchServices();
```

Run it

```sh
node boomsInit.js
[Booms] The remote services definitions will be saved to ./boomsServices
[09:43:54] Done.
```

2\) Create "index.js".

```js
const {s1} = require('./boomsServices');
const main = async () => {
    const result = await s1.say.hi('owen', 100);
    console.log(result);
};
main();
```

3\) Run

```sh
node index.js
{ msg: 'Hi, I am owen, 100 years old.' }
```

## Usage

### 1\. Server

1\) Install Booms: `npm install booms --save`
2\) Create business function files like below in a directory such as "[./src](./examples/service1/src)" (or any other name)

```js
// ./src/say.hi.js
module.exports = async (name, age) => {
    return {msg: `Hi, I am ${name}, ${age} years old.`};
};
```
3\) Create "index.js"

```js
require('booms').initService();
```

4\) Run

```sh
node index.js
Service s1 is running on port 50051...
```

### 2\. Client

1\) Install Booms: `npm install booms --save`
2\) Create "boomsInit.js"

```js
require('booms').fetchServices();
```

Run it

```sh
node boomsInit.js
[Booms] The remote services definitions will be saved to ./boomsServices
[09:43:54] Done.
```

3\) Call the remote functions

```js
// do.js
const {s1} = require('./boomsServices');
const main = async () => {
    const result = await s1.say.hi('owen', 100);
    console.log(result);
};
main();
```

As we can see, we can require the remote services and call the remote functions as same as do it with local files. That is, we can  easily disassemble a project, move sub modules directories to any other location and load them as microservices any time without the caller having to adjust any code. 

## Example

See files in [examples](./examples) to learn more.

## Options

### Server

```js
// The options can be omitted if it is same as the following.
const options = {
    gRPC: {
        host: 'localhost'
    },
    redis: {
        host: 'localhost'
    },
};

require('booms').initService(options);
```

Or

```js
// The name of this microservice.
// If it is omitted, it will be set as "s1".
const serviceName = 's1';

// The name of the folder which will be loaded.
// It can be omitted if it is "./src".
// It should be started with "."
const folderName = './src'; 

// The order of the parameters can be arbitrary.
require('booms').initService(serviceName, folderName, options);
```

### Client

```js
// Only redis options required. 
// The options can be omitted if it is same as the following.
const options = {
    redis: {
        host: 'localhost'
    },
};

require('booms').fetchServices(options);
```

Or

```js
// The names of the remote services which will be fetched.
// If it is omitted, Booms will fetch all remote services definitions.
const servicesNames = ['s1', 's2']; 

// The folder where the remote services definitions will be stored.
// If it is omitted, it will be set as './boomsServices'.
const folderName = './boomsServices'; 

// The timer for redoing fetch (unit is seconds).
// If it is omitted, Booms will does fetch only once.
// When the remote services change frequently, use it.
const timer = 30;

require('booms').fetchServices(servicesNames, folderName, options, timer);
```

## Test

```sh
git clone https://github.com/hiowenluke/booms.git
cd booms
npm install
npm test
```

## Performance

Booms is extended from [gRPC-node](https://github.com/grpc/grpc-node). It is as fast as gRPC-node, much faster than socket-based and MQ-based RPC framworks. (See [Benchmark](https://github.com/hiowenluke/benchmark-easy))

## Why

* [Why Enterprises Are Embracing Microservices and Node.js](https://thenewstack.io/enterprises-embracing-microservices-node-js/)
* [Microservices With Node.js: Scalable, Superior, and Secure Apps](https://dzone.com/articles/microservices-with-nodejs-scalable-superior-and-se)

## License

[MIT](LICENSE)

Copyright (c) 2019, Owen Luke
