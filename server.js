/**
 * server
 *  * Initializes and runs the default server instance.
 * 
 * @todo develop flat_file adapter
 */

// set up our instance (also loads settings)
require('./boot/load.js');

// Load our requirements
global.c4.load([
    'adapters/http.js'//,
    //'adapters/mongodb.js'
]);


global.c4.adapters.http.start();

//global.c4.adapters.mongodb.start();