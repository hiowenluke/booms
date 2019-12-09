
const be = require('benchmark-easy')();
const client = require('./greeter_client');

be.before('./greeter_server');
be.start(client, 10000);
