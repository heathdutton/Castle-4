/**
 * a simple global instance handler
 * 
 * loads modules
 * loads settings
 */
 
/**
 * Base requirements: object and settings (which requires object)
 * grab object and settings, since we'll need those in everything
 */
try {
    var req = {
        object : require('../helpers/object.js'),
        settings : require('../config/global.js').settings,
        fs : require('fs')
    };
} catch(error) {
    console.log('Error: Cound not load base requirements: ' + error);
}

global.c4 = {
    /**
     * array of loaded scripts, 
     *  'path/of/script.js' : x  (x being the amount of times it has been requested)
     */
    loaded : {
        'helpers/object.js' : 1, // should be loaded by default since it is required (currently) by this module.
        'core/fs' : 2
    },
    /** function for loading modules as needed
     * 
     * example of module_array:  [etc.helpers.get, etc.settings]
     */
    load : function(module_array){
        var script = '';
        var file = '';
        for (i = 0; i < module_array.length; i++){
            script = module_array[i];
            // I'm going to trust that I won't screw up and put relative paths...
            //if (script.indexOf('../') === 0) script = script.replace('../','');
            //if (script.indexOf('./') === 0) script = script.replace('./','');
            // check if we've already loaded this...
            if (global.c4.loaded[script] === undefined){
                // time to load the script
                try {
                    // break the path down, but do not use a loop so that we can avoid eval
                    segments = script.replace('.js','').split('/');
                    if ([segments[0]] == 'core') {
                        file = script.replace('core/', '');
                    } else {
                        file = '../' + script;
                    }
                    switch (segments.length){
                        // Handle up to a path depth of 5
                        case 1:
                            global.c4[segments[0]] = require(file);
                        break;
                        case 2:
                            if (global.c4[segments[0]] === undefined) global.c4[segments[0]] = {};
                            global.c4[segments[0]][segments[1]] = require(file);
                        break;
                        case 3:
                            if (global.c4[segments[0]] === undefined) global.c4[segments[0]] = {};
                            if (global.c4[segments[0]][segments[1]] === undefined) global.c4[segments[0]][segments[1]] = {};
                            global.c4[segments[0]][segments[1]][segments[2]] = require(file);
                        break;
                        case 4:
                            if (global.c4[segments[0]] === undefined) global.c4[segments[0]] = {};
                            if (global.c4[segments[0]][segments[1]] === undefined) global.c4[segments[0]][segments[1]] = {};
                            if (global.c4[segments[0]][segments[1]][segments[2]] === undefined) global.c4[segments[0]][segments[1]][segments[2]] = {};
                            global.c4[segments[0]][segments[1]][segments[2]][segments[3]] = require(file);
                        break;
                        case 5:
                            if (global.c4[segments[0]] === undefined) global.c4[segments[0]] = {};
                            if (global.c4[segments[0]][segments[1]] === undefined) global.c4[segments[0]][segments[1]] = {};
                            if (global.c4[segments[0]][segments[1]][segments[2]] === undefined) global.c4[segments[0]][segments[1]][segments[2]] = {};
                            if (global.c4[segments[0]][segments[1]][segments[2]][segments[3]] === undefined) global.c4[segments[0]][segments[1]][segments[2]][segments[3]] = {};
                            global.c4[segments[0]][segments[1]][segments[2]][segments[3]][segments[4]] = require(file);
                        break;
                        default:
                            console.log('Error: Script path too deep: "' + module_array[i] + '"');
                    }
                    global.c4.loaded[script] = 1;
                } catch(error) {
                    console.log('Error: Could not load: "' + module_array[i] + '" - ' + error);
                }
            } else {
                // script is already loaded, up the count of requests by one.
                global.c4.loaded[script]++;
            }
        }
    },
    object: req.object,
    /**
     * merge settings based on selected environment
     */
    settings : req.object.merge(req.settings.env.global, req.settings.env[req.settings.active_env])
};

/**
 * Optionally load environmental settings should they exist in a sepperate file (for security reasons, thus excluding them from a repo):
 * 
 *  ./config/global.js
 *      glboal settings
 *      environmental settings (based on active_env)
 *  ./config/environment.js (name matching active_env, optional)
 *  
 */


global.c4.settings = req.object.merge(req.settings.env.global, req.settings.env[req.settings.active_env]);
