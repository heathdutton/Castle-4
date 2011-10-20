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

exports.start = function() {
    var settings = global.c4.settings.adapters.mongodb;
    console.log('Attempting to connect to database: ' + settings.database_name);
    var client = new Db(settings.database_name,
        new Server(settings.host, setting.port, {})),
        test = function (err, collection) {
            collection.insert({
                a:2
            }, function(err, docs) {

                collection.count(function(err, count) {
                    test.assertEquals(1, count);
                });

                // Locate all the entries using find
                collection.find().toArray(function(err, results) {
                    test.assertEquals(1, results.length);
                    test.assertTrue(results.a === 2);

                    // Let's close the db
                    client.close();
                });
            });
        };
}


/*
client.open(function(err, p_client) {
  client.collection('test_insert', test);
});
*/


// simple example:

sys = require("sys"),
debug = require('util').debug,
inspect = require('util').inspect,
test = require("assert");

var Db = require('../lib/mongodb').Db,
  Connection = require('../lib/mongodb').Connection,
  Server = require('../lib/mongodb').Server;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

sys.puts("Connecting to " + host + ":" + port);
var db = new Db('node-mongo-examples', new Server(host, port, {}), {native_parser:true});
db.open(function(err, db) {
  db.dropDatabase(function(err, result) {
    db.collection('test', function(err, collection) {      
      // Erase all records from the collection, if any
      collection.remove({}, function(err, result) {
        // Insert 3 records
        for(var i = 0; i < 3; i++) {
          collection.insert({'a':i});
        }
        
        collection.count(function(err, count) {
          sys.puts("There are " + count + " records in the test collection. Here they are:");

          collection.find(function(err, cursor) {
            cursor.each(function(err, item) {
              if(item != null) {
                sys.puts(sys.inspect(item));
                sys.puts("created at " + new Date(item._id.generationTime) + "\n")
              }
              // Null signifies end of iterator
              if(item == null) {                
                // Destory the collection
                collection.drop(function(err, collection) {
                  db.close();
                });
              }
            });
          });          
        });
      });      
    });
  });
});