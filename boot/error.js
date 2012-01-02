/**
 * Simple uncaught exception handling
 */
exports.start = function(){
    var util = require('util');
    process.on('uncaughtException', function (err) {
        // use error logging if possible
        var str = "Uncaught Exception " + util.inspect(err.stack, true);
        if (global.c4 !== undefined &&
            global.c4.boot !== undefined &&
            global.c4.boot.log !== undefined){
            global.c4.boot.log.out(str, 3); // Critical
        } else {
            console.log(str);
        }
    });
}

exports.stop = function(){
    process.on('uncaughtException', function (err) {
        // do nothing
    });
}
