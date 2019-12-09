
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
node ./example/service1
# Service s1 is running...
```

2\) Open a new tab in terminal, then:

```sh
node ./example/service2
# Service s2 is running...
```

### 2. Run client

1\) Open a new tab in terminal, then:

```sh
node ./example/client-with-object-style

# Microservices #1
# Microservices #2
# { msg: 'Hi, I\'m owen, 100 years old.' }
```

**Press Ctrl + C twice to quit this demo.**

2\) Open a new tab in terminal, then:

```sh
node ./example/client-with-message-style

# Microservices #1
# Microservices #2
# { msg: 'Hi, I\'m owen, 100 years old.' }
```

**Press Ctrl + C twice to quit this demo.**

## Usage

1\. Create functions in directory "[./src](./example/service1/src)" in server project, such as below:

* [src/say/hi.js](./example/service1/src/say/hi.js)
```js
module.exports = async (name, age) => {
    return {msg: `Hi, I'm ${name}, ${age} years old.`};
};
```

* [src/about.js](./example/service1/src/about.js)
```js
module.exports = async () => {
    return `Microservices #1`;
};
```

2\. Load the directory "./src" as a microservice named "s1" in [index.js](./example/service1/index.js).

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

See files in directory [example](./example) to learn more.

## License

[MIT](LICENSE)

Copyright (c) 2019, Owen Luke
