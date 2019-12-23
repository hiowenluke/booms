
# Booms

A high-performance and easy-to-use RPC microservices framework for [Node.js](https://nodejs.org), load a directory as a RPC server, call the remote functions in it like **s1.say.hi()**, as same as do it at local. 

Booms is based on Node.js native TCP socket. It does not require you to write [proto](https://developers.google.com/protocol-buffers/docs/proto3) files, which is more easier to use.

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

1\) Run `mkdir -p src/say` to create folders, then create file "./src/say/hi.js"

```js
module.exports = async (name, age) => {
    return {msg: `Hi, I am ${name}, ${age} years old.`};
};
```

2\) Create file "index.js"

```js
// Create a server named "s1"
require('booms').server.init('s1');
```

3\) Run

```sh
node index.js
Server s1 listening on localhost:50051...
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


2\) Create file "index.js"

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

## Example

See files in [examples](./examples) to learn more.

## Options

### Server

```js
// The options can be omitted if it is same as the following.
const options = {
    server: {
        host: 'localhost'
    },
    redis: {
        host: 'localhost'
    },
};

require('booms').server.init(options);
```

Or

```js
// The name of this server.
// If it is omitted, it will be set as "s1".
const serverName = 's1';

// The name of the folder which will be loaded.
// It can be omitted if it is "./src".
// It should be started with "."
const folderName = './src'; 

// The order of the parameters can be arbitrary.
require('booms').server.init(serverName, folderName, options);
```

### Client


```js
// The names of the remote services which will be fetched.
// If it is omitted, Booms will fetches all.
const serverNames = ['s1', 's2']; // Or "s1" if you just need it.

// The folder where the remote services definitions will be stored.
// If it is omitted, it will be set as './boomsServices'.
// It should be started with "."
const saveToFolder = './boomsServices'; 

// The timer for redoing fetch (unit is seconds).
// If it is omitted, Booms will does fetch only once.
// When the remote services change frequently, use it.
const timer = 30;

// The order of the parameters can be arbitrary.
require('booms').client.fetchServers(serverNames, saveToFolder, options, timer);
```

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

With Booms, we can require the remote services and call the remote functions as same as we do it at local. That is, we can  easily disassemble a project, move any sub module directory to any other location and load it as a microservices any time without the caller having to adjust any code. 

## Why Microservices

* [Why Enterprises Are Embracing Microservices and Node.js](https://thenewstack.io/enterprises-embracing-microservices-node-js/)
* [Microservices With Node.js: Scalable, Superior, and Secure Apps](https://dzone.com/articles/microservices-with-nodejs-scalable-superior-and-se)

## License

[MIT](LICENSE)

Copyright (c) 2019, Owen Luke
