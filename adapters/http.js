/**
 * http handler
 * 
 * opens the http web handler
 */
 
exports.http = function(c4, params, settings){
    var http = require('http');
    http.createServer(function(req, res) {
        // here we might put our url handling
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World\n');
    }).listen(settings.port, settings.host);
    console.log('Http server active: ' + settings.host + ':' + settings.port);
};