/**
 * etc/settings
 */

/**
 * declare our global settings here
 */
exports.settings = { // will be set to global combined with whatever is set as active_env
    active_env : 'joyent', // set to the environment for this deployment
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
        cloud9 : {
            env_name : 'cloud9',
            adapters : {
                http : {
                    port : process.env.C9_PORT,
                    host : '0.0.0.0'
                }
            }
        },
        heroku : {
            env_name : 'heroku',
            adapters : {
                http : {
                    port : 80,
                    host : '0.0.0.0'
                }
            }
        },
        joyent : {
            env_name : 'joyent',
            adapters : {
                http : {
                    port : 80,
                    host : '0.0.0.0'
                }
            }
        },
        prod : {
            env_name : 'production'
        }
    }
};