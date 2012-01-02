/**
 * Global log file handler
 */


/**
 * severity:
 * 0 - Non-error (status log)
 * 1 - Notice - Minor infractions
 * 2 - Warning - Recoverable error
 * 3 - Severe - Application is unstable
 * 4 - Critical - Application must end because integrity may be compromized
 */
exports.out = function(str, severity){
    var fs = (global.c4 !== undefined &&
        global.core !== undefined &&
        global.c4.core.fs !== undefined) ? global.c4.core.fs : require('fs');
    var date = new Date();

    str = date.getFullYear() +
        '-' + date.getMonth() +
        '-' + date.getDay() +
        ' ' + date.getHours() +
        ':' + date.getMinutes() +
        ':' + date.getSeconds() +
        ':' + date.getMilliseconds() +
        '+' + date.getTimezoneOffset() +
        ' ' + (severity > 0 ? 'ERROR(' + severity + ')' : 'Status') +
        ' ' + str.toString().replace(/\r\n|\r|\n|\\n/g, ' ').replace(/\s+/g, ' ') + '\n';
    
    fs.open('./logs/' + (severity > 0 ? 'exception' : 'status') + '.log', 'a', 0666, function(err, fd){
        fs.writeSync(fd, str);
        fs.closeSync(fd);
    });

    if (global.c4.settings.boot !== undefined &&
        global.c4.settings.boot.log !== undefined &&
        global.c4.settings.boot.log.console_logging != undefined &&
        global.c4.settings.boot.log.console_logging < severity) console.log(str);
};