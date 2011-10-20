/**
 * settings/example.js
 * 
 * This file's settings will be merged (overwriting) the global settings only if it is present
 * and the active_env is set to the name of this file ("example") minus the .js extension.
 * 
 * The purpose of this is such that you can have server-level environmental parameters that are kept secure,
 * and outside of your repos. This should aid in simplifying large-scale deployments, since the file in question can
 * be different on a per-server basis, matching the local settings.
 */

exports.settings = {
    adapters : {
        http : {
            port : 8080 // this settings will override whatever has been set inside global.js, but only when the "example" environment is active
        }
    }
};