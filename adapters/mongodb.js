/**
 * mongodb adaptor - data adaptor making use of node-mongodb-native
 * 
 * This requires mongodb installed in ./third_party/mongodb/
 * To install run the following:
 * 
 * get the repo from: https://github.com/christkv/node-mongodb-native
 * run: sudo npm install path/to/node-mongodb-native --mongodb:native
 * run: sudo bash /path/to/node-mongodb-native/Makefile
 * 
 */

/**
 * Start the MongoDB database and collection connection, and make them globally available
 */
exports.start = function(){
    var success = false;
    if (typeof global.c4.adapters.mongodb.collection === undefined){
        var settings = global.c4.settings.adapters.mongodb;

        var sys = require("sys"),
        debug = require('util').debug,
        inspect = require('util').inspect,
        test = require("assert");

        var Db = require('../third_party/mongodb').Db,
        Connection = require('../third_party/mongodb').Connection,
        Server = require('../third_party/mongodb').Server;

        // Use environmental defaults if we must
        settings.host = settings.host ? settings.host : (process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost');
        settings.port = settings.port ? settings.port : (process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT);
        settings.database_name = settings.database_name ? settings.database_name : 'local';
        settings.collection_name = settings.collection_name ? settings.collection_name : 'castle4';

        global.c4.boot.log.out("Connecting to MongoDB at " + settings.host + ":" + settings.port);
        var database = new Db(settings.database_name, new Server(settings.host, settings.port, {}), {
            native_parser : false // turned native parsing off so that compilation isn't required
        });

        database.open(function(err, database){
            // save globally
            global.c4.adapters.mongodb.database = database;
            database.collection(settings.collection_name, function(err, collection) {
                // save globally
                global.c4.adapters.mongodb.collection = collection;
                success = true;
            });
        });
    } else {
        // Connection already established
        success = true;
    }
    return success;
}

/**
 * Close the MongoDB database connection
 */
exports.stop = function(){
    var success = false;
    if (typeof global.c4.adapters.mongodb.db !== undefined){
        global.c4.adapters.mongodb.db.close(function(err, db) {
            delete global.c4.adapters.mongodb.db;
            success = true;
        });
    } else {
        // Connection was never began
        success = true;
    }
    return success;
}