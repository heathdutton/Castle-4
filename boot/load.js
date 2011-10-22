/**
 * boot/load.js
 * 
 * A simple global instance handler and boot-loader
 * 
 * Handles loading modules and settings into a global instance for tracking and performance reasons
 * 
 */
 
/**
 * Base requirements: object and settings (which requires object)
 * grab object and settings, since we'll need those in everything
 */
try {
    var req = {
        settings : require('../settings/global.js').settings,
        object : require('../helpers/object.js'),
        path : require('path')
    };
} catch(error) {
    console.log('Error: Cound not load base requirements for the boot loader: ' + error);
}

global.c4 = {
    /**
     * add prereqs to this boot loader to the global c4 object
     */
    helpers : {
        object: req.object
    },
    core : {
        path : req.path
    },
    boot : {
        load : {
            /**
             * name-value pair of loaded scripts in the order they are originally requested 
             *  'path/of/script.js' : x  (x being the amount of times it has been requested)
             */
            loaded : {
                'settings/global.js' : 1,
                'helpers/object.js' : 1,
                'core/path' : 1,
                'boot/load.js' : 1
            }
        }
    },
    /**
     * function for loading modules as needed
     * example of module_array:  [etc.helpers.get, etc.settings]
     */
    load : function(module_array){
        var script = '',
            file = '';
        for (i = 0; i < module_array.length; i++){
            script = module_array[i];
            // I'm going to trust that I won't screw up and put relative paths...
            //if (script.indexOf('../') === 0) script = script.replace('../','');
            //if (script.indexOf('./') === 0) script = script.replace('./','');
            // check if we've already loaded this...
            if (global.c4.boot.load.loaded[script] === undefined){
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
                    global.c4.boot.load.loaded[script] = 1;
                } catch(error) {
                    console.log('Error: Could not load: "' + module_array[i] + '" - ' + error);
                }
            } else {
                // script is already loaded, up the count of requests by one.
                global.c4.boot.load.loaded[script]++;
            }
        }
    },
    /**
     * merge settings based on selected environment
     */
    settings : req.object.merge(
        req.settings.environments.global, // global settings
        req.settings.environments[req.settings.active_environment] // settings for the selected environment (still in global.js)
    )
};

/**
 * Optionally load environmental settings should they exist in a sepperate file
 */
var environmental_settings_file = '../settings/' + req.settings.active_environment + '.js';
if (global.c4.core.path.existsSync(environmental_settings_file)){
    try {
        var env_settings = require(environmental_settings_file).settings;
        global.c4.settings = req.object.merge(global.c4.settings, env_settings);
    } catch(error) {
        console.log('Could not load environmental settings from: "' + environmental_settings_file + '" - ' + error)
    }
}