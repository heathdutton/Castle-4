/**
 * load  - auto-loader for modules, functions, and their default objects
 * 
 * Sets up the c4 instance, and our method of loading data/modules
 */
 
var c4; // dclared globally, will refference the parent instance object

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

/**
 * export the autoloader, taking the instance in to the module
 */
exports.load = function(instance){
    c4 = instance;
    return load;
};
