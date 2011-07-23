// crude instance handler

global.c4 = {
    /** function for loading modules as needed
     *  
     * example of module_array:  [etc.helpers.get, etc.settings]
     */
    load : function(module_array){
        for (i = 0; i < module_array.length; i++){
            if (eval('global.c4.' + module_array[i]) === undefined){
                console.log('trying to load ' + module_array[i]);
                //step through and create objects as needed
                var segments = module_array[i].split('.');
                var string = '';
                for (s = 0; s < segments.length - 1; s++){ // step through segments, except the last one
                    string += '.' + segments[s];
                    if (eval('global.c4' + string) === undefined){
                        eval('global.c4' + string) = {};
                    }
                }
                if (module_array[i].indexOf('core.') === 0) {
                    try {
                        eval('global.c4.' + module_array[i]) = require(module_array[i].replace('core.', ''));
                    } catch(err1) {
                        console.log('Unable to load core module: ' + filename + ' - ' + err1);
                    }
                } else {
                    try {
                        eval('global.c4.' + module_array[i]) = require('../' + module_array[i].replace('.', '/') + '.js');
                        console.log('loaded: ' + module_array[i]);
                    } catch(err2) {
                        console.log('Unable to load custom module: ' + err2);
                    }
                }
            }
        }
    }
};