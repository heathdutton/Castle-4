/**
 * http handler
 * 
 * opens the http web handler
 */
 
exports.http = function(c4, params, settings){
    var http = c4.load('core', 'http');
    http.createServer(function(req, res) {
        // here we might put our url handling
        res.writeHead(200, {'Content-Type': 'text/plain'});
        var test = '';
        for (i = 0; i < 10000; i++){
            test += ' :) ' + i + '\n';  
        }
        res.end('Hi there\n' + test);
    }).listen(settings.port, settings.host);
    console.log('Http server active: ' + settings.host + ':' + settings.port);
};