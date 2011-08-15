/**
 * server
 *  * Initializes and runs the default server instance.
 * 
 * @todo develop flat_file adapter
 */

// set up our instance (also loads settings)
require('./boot/bootloader.js');

// Load our requirements
global.c4.load([
    'adapters/http.js'
]);


global.c4.adapters.http.start();