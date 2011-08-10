/**
 * load  - auto-loader for modules, functions, and their default objects
 * 
 * Sets up the c4 instance, and our method of loading data/modules
 */

// get base requirements
var object = require('../helpers/object.js');
var settings = require('../etc/settings.js').settings;

global.c4 = {
	// global application settings (based on selected environment)
	settings : object.merge(settings.env.global, settings.env[settings.active_env]),
	// load function - load an array of required modules, if not already in our instance
	load : function(array){
		
	}
};

/**
 * load
 * 
 * autoloader - loads from the instance, and then from modules if needed
 * used: c4.load('etc', 'settings', 'test') - would load: c4.etc.settings.test
 */
var load = function(type, name, method, params){
    // return entire instance: c4()
    if (type === undefined){
        return c4;
    }
    // build root data type /etc
    if (typeof c4[type] !== 'object'){
        c4[type] = {};
    }
    // require module if not here /etc/settings
    if (typeof c4[type][name] !== 'object' ||
        (method !== undefined && c4[type][name][method] === undefined)){
        if (type == 'core'){
            c4[type][name] = require(name);
        } else {
            c4[type][name] = require('../' + type + '/' + name + '.js');
        }
    }    
    // handle modules that only have a simple return /etc/settings.settings
    if (method === undefined){
        method = name;
    }    
    // return function /etc/settings/run()
    if (typeof c4[type][name][method] == 'function'){
        // default params
        if (params === undefined){
            params = {};
        }
        // get settings for this module (if applicable)
        c4.settings = require('../etc/settings.js').settings();
        var settings = {};
        if (c4.settings[type] !== undefined && 
            c4.settings[type][name] !== undefined){
            if (method !== undefined &&
                c4.settings[type][name][method] !== undefined){            
                if (c4.settings[type][name][method][method] !== undefined){
                    settings = c4.settings[type][name][method][method];
                } else {
                    settings = c4.settings[type][name][method];
                }
            } else {
                if (c4.settings[type][name][name] !== undefined){
                    settings = c4.settings[type][name][name];
                } else if (c4.settings[type][name] !== undefined){
                    settings = c4.settings[type][name];
                }
            }
        }
        return c4[type][name][method](c4, params, settings);
    // return other (object/string/array) /etc/settings/test
    } else if (c4[type][name][method] !== undefined){
        return c4[type][name][method];
    } else if (c4[type][name] !== undefined &&
        method == name){
        return c4[type][name]; // likely a core module or a module without an exporting function of the same name
    } else {
        console.log('Error in ' + __filename + ' - object not found: c4.' + type + '.' + name + '.' + method);
    }
};

