/**
 * etc/settings
 */

/**
 * declare our global settings here
 */
var settings = { // will be set to global combined with whatever is set as active_env
    active_env : 'dev', // set to the environment for this deployment
    env : {
        global : { // where you store global default settings for all environments (they are overridden by chosen env)
            // The following will be treated as from the root for module settings.
            server : {
                name : 'Castle 4',
                version : '0.1'
            },
            adapters : {
                http : {
                    port : 80,
                    host : '127.0.0.1'
                }
            }
        },
        dev : {
            env_name : 'development',
            adapters : {
                http : {
                    port : process.env.C9_PORT,
                    host : '0.0.0.0'
                }
            }
        },
        beta : {
            env_name : 'beta'
        },
        prod : {
            env_name : 'production'
        }
    }
};

// Do not modify below this line. The following loads the settings and merges based on selected active_env

/*
* recursively merge properties of two objects 
*/
function merge_objects(obj1, obj2) {
    for (var p in obj2) {
        try {
            // Property in destination object set; update its value.
            if (obj2[p].constructor==Object) {
                obj1[p] = MergeRecursive(obj1[p], obj2[p]);            
            } else {
                obj1[p] = obj2[p];
            }        
        } catch(e) {
            // Property in destination object not set; create it and set its value.
            obj1[p] = obj2[p];
        }
    }
    return obj1;
}

/**
 * export the settings
 */
exports.settings = function(){
    // return global environment settings, merged with the environment set as active_env
    return merge_objects(settings.env.global, settings.env[settings.active_env]);
};
