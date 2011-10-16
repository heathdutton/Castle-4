/**
 * mongodb adaptor
 * 
 * This requires mongodb installed, using the following method:
 * 
 * get the repo from: https://github.com/christkv/node-mongodb-native
 * run: sudo npm install path/to/node-mongodb-native --mongodb:native
 * run: sudo bash /path/to/node-mongodb-native/Makefile
 * 
 */

exports.start = function() {
    var settings = global.c4.settings.adapters.mongodb;
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