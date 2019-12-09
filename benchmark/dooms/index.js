
const be = require('benchmark-easy')();
const client = require('./client');

be.before('./service');
be.start(client, 10000);
