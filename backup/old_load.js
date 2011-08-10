/**
 * load  - auto-loader for modules, functions, and their default objects
 * 
 * Sets up the c4 instance, and our method of loading data/modules
 * 
 * requires:
 *      etc/settings.js
 *      helpers/object.js
 */

var c4; // declared globally, will refference the parent instance object when load is used

// Get requirements
var req = {
    object : require('../helpers/object.js'),           // all object methods
    settings : require('../etc/settings.js').settings   // global settings object
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
        // pull global settings if we don't have them in the instance already
        if (c4.etc === undefined) c4.etc = {};
        if (c4.etc.settings === undefined){
            // load the objects module if not already loaded (loading the old-fasioned way for now)
            if (c4.helpers === undefined) c4.helpers = {};
            if (c4.helpers.object === undefined) c4.helpers.object = req.object;
            // here we pull the environmental variables as needed merged with the global settings
            c4.etc.settings = c4.helpers.object.merge(req.settings.env.global, req.settings.env[req.settings.active_env]);  
        }
        // get settings for this module (if applicable)
        var module_settings = {};
        if (c4.etc.settings[type] !== undefined && 
            c4.etc.settings[type][name] !== undefined){
            if (method !== undefined &&
                c4.etc.settings[type][name][method] !== undefined){            
                if (c4.etc.settings[type][name][method][method] !== undefined){
                    module_settings = c4.etc.settings[type][name][method][method];
                } else {
                    module_settings = c4.etc.settings[type][name][method];
                }
            } else {
                if (c4.etc.settings[type][name][name] !== undefined){
                    module_settings = c4.etc.settings[type][name][name];
                } else if (c4.etc.settings[type][name] !== undefined){
                    module_settings = c4.etc.settings[type][name];
                }
            }
        }
        process.c4 = c4;
        return c4[type][name][method](c4, params, module_settings);
    // return other (object/string/array) /etc/settings/test
    } else if (c4[type][name][method] !== undefined){
        process.c4 = c4;
        return c4[type][name][method];
    } else if (c4[type][name] !== undefined &&
        method == name){
        process.c4 = c4;
        return c4[type][name]; // likely a core module or a module without an exporting function of the same name
    } else {
        console.log('Error in ' + __filename + ' - object not found: c4.' + type + '.' + name + '.' + method);
    }
};

/**
 * export the autoloader, taking the instance in to the module
 */
exports.load = function(instance){
    c4 = instance;
    return load;
};
