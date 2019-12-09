
# Dooms

A light and easy-to-use microservices framework for [Node.js](https://nodejs.org). Dooms loads a directory as a microservice, so that the client can calls remote functions in it with Object Style like **service1.do.say.hi('Hello world!')** or Message Style like **call('service1:/do/say/hi', 'Hello world!')** and gets the results immediately. 

Dooms is based on [gRPC](https://grpc.io) and [Redis](https://github.com/antirez/redis). 

* [Why Enterprises Are Embracing Microservices and Node.js](https://thenewstack.io/enterprises-embracing-microservices-node-js/)
* [Microservices With Node.js: Scalable, Superior, and Secure Apps](https://dzone.com/articles/microservices-with-nodejs-scalable-superior-and-se)

## Server Environment

1\. [Install Docker](https://docs.docker.com/v17.09/engine/installation/#supported-platforms) (Docker CE recommended)

2\. Install Redis in Docker  
1\) Install: `docker pull redis`  
2\) Start: `docker run --restart=always --name redis -d -p 6379:6379 -it redis redis-server`   

## Install

```sh
npm install dooms --save
```

## Test

Download this repo

```sh
git clone https://github.com/hiowenluke/dooms.git
cd dooms
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

**Press Ctrl + C twice to quit this demo.**

2\) Open a new tab in terminal, then:

```sh
node ./examples/client-with-message-style

# Microservices #1
# Microservices #2
# { msg: 'Hi, I\'m owen, 100 years old.' }
```

**Press Ctrl + C twice to quit this demo.**

## Usage

1\. Create functions in directory "[./src](./examples/service1/src)" in server project, such as below:

* [src/say/hi.js](./examples/service1/src/say/hi.js)
```js
module.exports = async (name, age) => {
    return {msg: `Hi, I'm ${name}, ${age} years old.`};
};
```

* [src/about.js](./examples/service1/src/about.js)
```js
module.exports = async () => {
    return `Microservices #1`;
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

require('dooms').initServer('s1', './src');
```

3\. Client: call the remote functions with Object Style

```js
const services = require('dooms').initServices();

const main = async () => {

    // Get services by names 's1', 's2', ..., etc.
    // If the names are omitted, all services will be returned
    const {s1} = await services('s1');

    let result;
    result = await s1.about();
    console.log(result); // "Microservices #1"

    result = await s1.say.hi('owen', 100);
    console.log(result); // {msg: 'Hi, I\'m owen, 100 years old.'}
};

main();
```

4\. Client: call the remote functions with Message Style:

```js
const call = require('dooms').initCall();

const main = async () => {
    let result;

    result = await call('s1:/about');
    console.log(result); // "Microservices #1"

    result = await call('s1:/say/hi', 'owen', 100);
    console.log(result); // {msg: 'Hi, I\'m owen, 100 years old.'}
};

main();
```

## Options

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
        // password: 'auth',       // Redis password
        // db: 0,                  // Redis database number
        // family: 4,              // 4 (IPv4) or 6 (IPv6)
    },
};
```

For initializing server:
```js
require('dooms').initServer('s1', './src', options);
```

For initializing client with Object Style:
```js
require('dooms').initServices(options);
```

For initializing client with Message Style:
```js
require('dooms').initCall(options);
```

## Example

See files in directory [examples](./examples) to learn more.

## Benchmark

Dooms is extends from gRPC-node, making it easy for node.js developers to use gRPC. However, Dooms' performance is still close to gRPC-node.

**gRPC-node**

```sh
node ./benchmark/gRPC-node
```
```sh
Running scripts...
Benchmarking [10000] times, [10] runs.
Starting...
Run #1: 3.303 seconds, 3028 times/sec.
Run #2: 3.091 seconds, 3235 times/sec.
Run #3: 3.123 seconds, 3202 times/sec.
Run #4: 3.012 seconds, 3320 times/sec.
Run #5: 3.026 seconds, 3304 times/sec.
Run #6: 3.102 seconds, 3223 times/sec.
Run #7: 3.071 seconds, 3256 times/sec.
Run #8: 3.152 seconds, 3172 times/sec.
Run #9: 3.138 seconds, 3186 times/sec.
Run #10: 3.126 seconds, 3198 times/sec.
Done.
Average: 3.11 seconds, 3212 times/sec.
```

**Dooms**

```sh
node ./benchmark/dooms
```
```sh
Running scripts...
Benchmarking [10000] times, [10] runs.
Starting...
Run #1: 3.722 seconds, 2686 times/sec.
Run #2: 3.324 seconds, 3008 times/sec.
Run #3: 3.353 seconds, 2982 times/sec.
Run #4: 3.312 seconds, 3019 times/sec.
Run #5: 3.258 seconds, 3069 times/sec.
Run #6: 3.217 seconds, 3108 times/sec.
Run #7: 3.357 seconds, 2978 times/sec.
Run #8: 3.286 seconds, 3043 times/sec.
Run #9: 3.105 seconds, 3221 times/sec.
Run #10: 3.345 seconds, 2989 times/sec.
Done.
Average: 3.33 seconds, 3010 times/sec.
```


## License

[MIT](LICENSE)

Copyright (c) 2019, Owen Luke
