/**
 * settings/global.js
 * 
 * You can set environmentally specific settings in this file.
 * 
 * If you need secure settings information, put them in a file with a name matching the active environment:
 * settings/example.js   (see example.js for details)
 */

/**
 * declare our global settings here
 */
exports.settings = { // will be set to global combined with whatever is set as active_environment
    active_environment : 'local', // set to the environment for this deployment
    environments : { 
        global : { // where you store global default settings for all environments (they are overridden by chosen env)
            // The following will be treated as from the root for module settings.
            server : {
                name : 'Castle 4',
                version : '0.2'
            },
            adapters : {
                http : {
                    port : 80,
                    host : '127.0.0.1'
                },
                mongodb : {
                    port : 27017,
                    host : '127.0.0.1',
                    database_name : 'local',
                    collection_name : 'castle4',
                    user : 'root',
                    pass : 'root'
                }
            },
            boot : {
                log : {
                    console_logging : 1 // define the level of notices 0-4
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
        }
    }
};