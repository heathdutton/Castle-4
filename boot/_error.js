/**
 * Global Error handler
 */


process.on('uncaughtException', function (err) {
    console.log('C4 Error: ' + err);
});