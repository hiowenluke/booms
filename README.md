
# Booms

A RPC microservices framework for [Node.js](https://nodejs.org), loads a directory as a microservice, calls remote functions in it like **s1.say.hi()** or **call('s1:/say/hi')**. Booms is based on [gRPC-node](https://github.com/grpc/grpc-node), but no [proto](https://developers.google.com/protocol-buffers/docs/proto3) files needed, more easy to use.

## Server Environment

1\. [Install Docker](https://docs.docker.com/v17.09/engine/installation/#supported-platforms) (Docker CE recommended)

2\. Install Redis in Docker  
1\) Install: `docker pull redis`  
2\) Start: `docker run --restart=always --name redis -d -p 6379:6379 -it redis redis-server`   

## Install

```sh
npm install booms --save
```

## Test

Download this repo

```sh
git clone https://github.com/hiowenluke/booms.git
cd booms
npm install
```

Test

```sh
npm test
```

## TRY IT!

To run this demo, download this repo first if not yet (see above).

### 1. Run microservices

1\) Open a new tab in terminal, then:

```sh
node ./examples/service1
# Service s1 is running...
```

2\) Open a new tab in terminal, then:

```sh
node ./examples/service2
# Service s2 is running...
```

### 2. Run client

1\) Open a new tab in terminal, then:

```sh
node ./examples/client-with-object-style

# Microservices #1
# Microservices #2
# { msg: 'Hi, I\'m owen, 100 years old.' }
```

2\) Open a new tab in terminal, then:

```sh
node ./examples/client-with-message-style

# Microservices #1
# Microservices #2
# { msg: 'Hi, I\'m owen, 100 years old.' }
```

## Usage

1\. Create function files in directory "[./src](./examples/service1/src)" in server project, such as below:

* [src/say/hi.js](./examples/service1/src/say/hi.js)
```js
module.exports = async (name, age) => {
    return {msg: `Hi, I'm ${name}, ${age} years old.`};
};
```

2\. Load the directory "./src" as a microservice named "s1" in [index.js](./examples/service1/index.js).

```js
// "s1"
//      The name of this microservice.
//      It can be omitted if you have only one microservice.

// "./src"
//      The root folder name of business files such as "src/say/hi.js".
//      It can be omitted or replaced with other names such as "./biz", "./src", etc.
//      It should be started with ".".

require('booms').initService('s1', './src');
```

3\. Call like s1.say.hi()

```js
const services = require('booms').initClient();

const main = async () => {
    const {s1} = await services();
    const result = await s1.say.hi('owen', 100);
    console.log(result); // {msg: 'Hi, I\'m owen, 100 years old.'}
};

main();
```

4\. Call like call('s1:/say/hi')

```js
const call = require('booms').initCall();

const main = async () => {
    const result = await call('s1:/say/hi', 'owen', 100);
    console.log(result); // {msg: 'Hi, I\'m owen, 100 years old.'}
};

main();
```

## Options

1\. For server

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
```

2\. For client

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
require('booms').initCall(options);
```

## Example

See files in directory [examples](./examples) to learn more.

## Performance

Booms is extended from [gRPC-node](https://github.com/grpc/grpc-node). It is as fast as gRPC-node, much faster than socket.io-based RPC. (See [Benchmark](https://github.com/hiowenluke/benchmark-easy))

## Why

* [Why Enterprises Are Embracing Microservices and Node.js](https://thenewstack.io/enterprises-embracing-microservices-node-js/)
* [Microservices With Node.js: Scalable, Superior, and Secure Apps](https://dzone.com/articles/microservices-with-nodejs-scalable-superior-and-se)

## License

[MIT](LICENSE)

Copyright (c) 2019, Owen Luke
