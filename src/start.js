var config = require('config');
var server = require('./server.js');

server.start(config.get('UserService.port'));