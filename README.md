
# Booms

A high-performance and easy-to-use RPC microservices framework for [Node.js](https://nodejs.org), load a directory as a RPC server, call a remote function or method of a remote object like **s1.say.hi()**, as same as do it at local. Booms can passes not only data, but also callback functions to the server, that's awesome.

Booms is based on Node.js native TCP socket. It does not require you to write [proto](https://developers.google.com/protocol-buffers/docs/proto3) files, which is more easier to use.

## Server Environment

Booms uses [Redis](https://redis.io) to store the remote services definition data. If you haven't installed it, please perform the following steps to install it in docker.

1\. [Install Docker](https://docs.docker.com/v17.09/engine/installation/#supported-platforms) (Docker CE recommended)

2\. Install Redis in Docker  
1\) Install: `docker pull redis`  
2\) Start: `docker run --restart=always --name redis -d -p 6379:6379 -it redis redis-server`   

## Install

```sh
npm install booms --save
```

## TRY IT! (in under 5 minutes)

Create a demo directory first.

```sh
mkdir ./booms-demo && cd ./booms-demo
```

#### 1. Server

0\) Initialize this server

```sh
mkdir ./server && cd ./server
npm init -y
npm install booms --save
```

1\) Run `mkdir -p src/say` to create directories, then create file "./src/say/hi.js"

```js
module.exports = async function (name, age) {
    return {msg: `Hi, I am ${name}, ${age} years old.`};
};
```

2\) Create file "index.js". (See [options](#Server-Options))

```js
// Create a server named "s1"
require('booms').server.init('s1');
```

3\) Run

```sh
node index.js
Server s1 listening on localhost:50051
```

#### 2. Client

Open a new tab in your terminal first.

0\) Initialize this client

```sh
cd ..
mkdir ./client && cd ./client
npm init -y
npm install booms --save
```

1\) Create file "index.js"

```js
const {s1} = require('booms/services');
const main = async function () {
    const result = await s1.say.hi('owen', 100);
    console.log(result);
};
main();
```

2\) Run

```sh
node index.js
{ msg: 'Hi, I am owen, 100 years old.' }
```

BTW: Booms client fetches the remote services definition data and save it to the file "[./boomsServices.js](./examples/client/boomsServices.js)" so that you can easily view all the microservices APIs information. You can disable it, see [options](#Client-Options).

## Examples

See [examples](./examples) to learn more, including two servers and two clients.

## Call Remote Object method

You can also call a method of a remote object. Cool, right?

#### 1\. In Server

```js
// obj.js
module.exports = {
    async do() {
        return `I am obj.do()`;
    }
};
```

[Demo](./examples/server1/src/obj.js)

#### 2\. In Client

```js
const {s1} = require('booms/services');
const main = async function () {
    const result = await s1.obj.do();
    console.log(result); // "I am obj.do()"
};
main();
```

[Demo](./examples/client/index.js)

## Passing Callback Function

Booms can passes not only data, but also callback functions to the server, that's awesome.

#### 1\. In Server

```js
// callback.js
module.exports = async function(hi, cb) {

    // The cb is the callback comes from the client.
    // The cb has wrapped as an asynchronous function by Booms automatically.
    // You should use keyword await when invoke it.

    // The cbResult is the result returned after the cb is executed.
    const cbResult = await cb(2);

    return hi + ', ' + cbResult;
};
```

[Demo](./examples/server1/src/callback.js)

#### 2\. In Client

```js
const {s1} = require('booms/services');

const main = async function () {
    const x = 1;
    
    // 1. The client passes a function to the server via Booms.
    // 2. The server calls it to get a result, and handles with it.
    // 3. The server returns the final result to the client.  
    const result = await s1.callback('hi', function (y) { 
        
        // The argument y is passed from the server, its value is 2
        return x + y;
    });
    
    console.log(result); // "hi, 3"
};

main();
```

[Demo](./examples/client/index.js)

## Calling Style

In addition to Object-Style calling like **s1.say.hi()**, Booms also supports Message-Style calling like **call('s1:/say/hi')**. [Demo](./examples/client-message-style)

## Options

#### Server Options

It can be omitted if it is the default value as below.

```js
const booms = require('booms');

const options = {
    name: 's1',
    dir: './src',
    host: 'localhost',

    redis: {
        host: 'localhost',
    }
};

booms.server.init(options);
```

[Demo](./examples/server2/index.js)
 
#### Client Options

Create file boomsConfig.js under your project root path to configure Booms client if needed. It can be omitted if it is the default value as below. 

```js
module.exports = {

    redis: {
        host: 'localhost',
    },

    // The server names which will be fetched
    servers: 'all', 
    
    // Whether to create boomsServics.js
    yesBoomsServicesFile: true 
};
```

[Demo](./examples/client/boomsConfig.js)

## Test

```sh
git clone https://github.com/hiowenluke/booms.git
cd booms
npm install
npm test
```

## Performance

Booms is based on Node.js native TCP socket, much faster than other RPC frameworks based on gRPC or MQ. (See [RPC Frameworks Performance PK](https://github.com/hiowenluke/rpc-frameworks-performance-pk))

## Why Booms

With Booms, you can require the remote services and call the remote functions as same as you do it at local. That is, you can  easily disassemble a project, move any sub module directory to any other location and load it as a microservices any time without adjust any code in parent module. 

## Why Microservices

* [Why Enterprises Are Embracing Microservices and Node.js](https://thenewstack.io/enterprises-embracing-microservices-node-js/)
* [Microservices With Node.js: Scalable, Superior, and Secure Apps](https://dzone.com/articles/microservices-with-nodejs-scalable-superior-and-se)

## License

[MIT](LICENSE)

Copyright (c) 2019, Owen Luke
