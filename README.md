
# Booms

A high-performance and easy-to-use RPC microservices framework for [Node.js](https://nodejs.org), load a directory as a RPC server, call the remote functions in it like **s1.say.hi()**, as same as do it at local. 

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

### 1. Server

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

2\) Create file "index.js". (See [options](#Server) to learn more)

```js
// Create a server named "s1"
require('booms').server.init('s1');
```

3\) Run

```sh
node index.js
Server s1 listening on localhost:50051
```

### 2. Client

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

BTW: Booms client fetches the remote services definition data and save it to the file "[./boomsServices.js](./examples/client/boomsServices.js)" so that you can easily view all the microservices APIs information.


## Example

See files in [examples](./examples) to learn more.

## Options

### Server

It can be omitted if it is the default value as below. See [demo file](./examples/server2/index.js) to learn more.

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

### Client

Create file boomsConfig.js under your project root path to configure Booms client if needed. It can be omitted if it is the default value as below. See [demo file](./examples/client/boomsConfig.js) to learn more.

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

## Calling Style

In addition to object-style calling of remote functions like **s1.say.hi()**, Booms also supports message-style calling of remote functions like **call('s1:/say/hi')**. See [this example](./examples/client-message-style) to learn more.


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

With Booms, we can require the remote services and call the remote functions as same as we do it at local. That is, we can  easily disassemble a project, move any sub module directory to any other location and load it as a microservices any time without adjust any code in parent module. 

## Why Microservices

* [Why Enterprises Are Embracing Microservices and Node.js](https://thenewstack.io/enterprises-embracing-microservices-node-js/)
* [Microservices With Node.js: Scalable, Superior, and Secure Apps](https://dzone.com/articles/microservices-with-nodejs-scalable-superior-and-se)

## License

[MIT](LICENSE)

Copyright (c) 2019, Owen Luke
