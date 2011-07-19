/**
 * server
 * 
 * Initializes and runs the default server instance.
 */

// declare our initial instance
var c4 = {};

// load the auto-loader into our instance. This should be the last require. This will also auto-load our settings.
c4.load = require('./helpers/load.js').load(c4);

console.log(
    '=========================================================' + "\n" +
    'Program: ' + c4.load('etc', 'settings').server.name + " v" + c4.load('etc', 'settings').server.version + "\n" +
    'Environment: ' + c4.load('etc', 'settings').env_name + "\n" +
    'Location: ' + __filename + "\n" +
    '========================================================='
);

// start the HTTP server
c4.load('adapters', 'http'); 