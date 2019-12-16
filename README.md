
# Booms

A high performance RPC microservices framework for [Node.js](https://nodejs.org), loads a directory as a microservice, calls remote functions in it like **s1.say.hi()** or **rpc('s1:/say/hi')**. Booms is based on [gRPC-node](https://github.com/grpc/grpc-node), but no [proto](https://developers.google.com/protocol-buffers/docs/proto3) files needed, more easy to use.

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

### 1. Server

0\) Initialize a demo project

```sh
mkdir ./booms-demo && cd ./booms-demo
npm init -y
npm install booms --save

# Create folders
mkdir -p src/say
```

1\) Create "./src/say/hi.js"

```js
module.exports = async (name, age) => {
    return {msg: `Hi, I am ${name}, ${age} years old.`};
};
```

2\) Create "index.js"

```js
require('booms').initService();
```

3\) Run

```sh
node index.js
```

```sh
Service s1 is running on port 50051...
```

### 2. Client: call like s1.say.hi()

1\) Open a new tab in your terminal, then create "s1.js".

```js
const services = require('booms').initClient();
const main = async () => {
    const {s1} = await services();
    const result = await s1.say.hi('owen', 100);
    console.log(result);
};
main();
```

2\) Run

```sh
node s1.js
```

```sh
{ msg: 'Hi, I am owen, 100 years old.' }
```

### 3. Client: call like rpc('s1:/say/hi')

1\) Open a new tab in your terminal, then create "rpc.js".

```js
const rpc = require('booms').initRpc();
const main = async () => {
    const result = await rpc('s1:/say/hi', 'owen', 100);
    console.log(result);
};
main();
```

2\) Run

```sh
node rpc.js
```

```sh
{ msg: 'Hi, I am owen, 100 years old.' }
```

## Example

See [examples](./examples) to learn more.

## Options

### 1. For server

```js
const options = {

    // Specify the gRPC options.
    // It can be omitted if the host is "localhost".
    gRPC: {
        host: 'localhost',      // gRPC host
    },

    // Specify the Redis options.
    // It can be omitted if it is the default options (like below) of Redis.
    redis: {
        host: 'localhost',      // Redis host
        // port: '6379',           // Redis port
        // db: 0,                  // Redis database number
        // family: 4,              // 4 (IPv4) or 6 (IPv6)
    },
};
```

Use it
```js
require('booms').initService('s1', './src', options);

// "s1"
//      The name of this microservice.
//      The default value is "s1".

// "./src"
//      The root folder name of business function files.
//      The default value is "./src"
//      It should be started with ".".
```

### 2. For client

Only redis options required.

```js
const options = {
    // Specify the Redis options.
    // It can be omitted if it is the default options (like below) of Redis.
    redis: {
        host: 'localhost',      // Redis host
        // port: '6379',           // Redis port
        // db: 0,                  // Redis database number
        // family: 4,              // 4 (IPv4) or 6 (IPv6)
    },
};
```

Use it
```js
require('booms').initClient(options);
```

Or
```js
require('booms').initRpc(options);
```

## Test

```sh
git clone https://github.com/hiowenluke/booms.git
cd booms
npm install
npm test
```

## Performance

Booms is extended from [gRPC-node](https://github.com/grpc/grpc-node). It is as fast as gRPC-node, much faster than socket.io-based RPC. (See [Benchmark](https://github.com/hiowenluke/benchmark-easy))

## Why

* [Why Enterprises Are Embracing Microservices and Node.js](https://thenewstack.io/enterprises-embracing-microservices-node-js/)
* [Microservices With Node.js: Scalable, Superior, and Secure Apps](https://dzone.com/articles/microservices-with-nodejs-scalable-superior-and-se)

## License

[MIT](LICENSE)

Copyright (c) 2019, Owen Luke
