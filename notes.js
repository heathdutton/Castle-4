
/**
 *  C4 object hierarchy:
 *  global.c4.core                  core node.js modules that are pulled in to be re-used
 *  global.c4.[path].[subpath]      c4 modules (the main body of this app)
 *  global.c4.third_party.[path]    third party modules
 *  
 *  mongodb data hierarchy:
 */

var c4 = {
    access_log : [   // this is the global access log, each app will have their own extending this one in their own user objects
        {
            ip : '127.0.0.1',
            user : id, // user id if we have authenticated
            time : datestamp,
            app : id, // application id, if applicable
            folder_id : id, // folder id, if applicable
            path : 'path/user/hit'
        }
    ],
    users : [
        { // for the sake of security, this is the only section that is not versioned.
            _id : 555,
            active : 1,  // user account is enabled
            username : 'hdutton',
            email : 'heathdutton@gmail.com',
            password_hash : 'i8af7t4iajy38gt8yif4832h9ugd2',
            preferences : { // global identifiers (hard-coded, rarely-if-ever changing)
                lanugage : 'EN', 
                currency : 'USD',
                market : 'US'   // where this user is most often "from"
            },
            addresses : [
                {
                    billing : 1,    // is this the default billing address?
                    shipping : 1,   // is this the default shipping address?
                    number : 4715,
                    road : 'Portobello Circle',
                    city : 'Valrico',
                    state : 'FL', // global, hard-coded
                    zip : 555555,
                    country : 'US' // global hard-coded
                }
            ],
            open_id : {}, // full support openID for Node.js
            permissions : {  // these are global permissions only, not site-specific
                create_apps : 10 // user can create this many apps
            }
        }
    ],
    apps : [
        {
            _id : 555,
            settings : {
                short_name : 'my_app', // strictly enforced. only used internally
                full_name : 'My App',  // only used internally, for admins to find the settings they need
                description : '',      // internal description
                user_revision : 1234,  // latest revision of user data changes
                app_revision : 1234    // latest revision of application changes (this is a global number that transverses the branches)
            },
            google : {
                analytics : {
                    active : 1, // use GA?
                    key : 'GA-1234567' // google analtyics key
                },
                search : {} // google search key/data to come
            },
            domains : [
                {
                    branches : { 
                        live : 1234,     // live branch to active revision id
                        id : 1234        // branch id, to active revision id. This is created whenever a revision is made at this branch
                    },
                    revisions : [
                        {
                            _id : 555,
                            rev_id : 1234,   // indexed
                            branch_id : id,  // indexed
                            active : 1,      // will be 0 if this market is deleted/deactivated
                            short_name : '.com',
                            full_name : 'mydomain.com',
                            default_market : id
                        }
                    ]
                }
            ],
            markets : [
                {
                    branches : { 
                        live : 1234,     // live branch to active revision id
                        id : 1234        // branch id, to active revision id. This is created whenever a revision is made at this branch
                    },
                    revisions : [
                        {
                            _id : 555,
                            rev_id : 1234,   // indexed
                            branch_id : id,  // indexed
                            active : 1,      // will be 0 if this market is deleted/deactivated
                            short_name : 'US', // global, hard-coded OLOCs
                            full_name : 'United States',
                            default_lang : id  // default language ID
                        }
                    ]
                }
            ],
            languages : [
                {
                    branches : { 
                        live : 1234,     // live branch to active revision id
                        id : 1234        // branch id, to active revision id. This is created whenever a revision is made at this branch
                    },
                    revisions : [
                        {
                            _id : 555,
                            rev_id : 1234,   // indexed
                            branch_id : id,  // indexed
                            active : 1,      // will be 0 if this market is deleted/deactivated
                            short_name : 'EN', // these should be global identifiers
                            full_name : 'English' // user can choose how it is displayed?
                        }
                    ]
                }
            ],
            aliases : [
                {
                    branches : { 
                        live : 1234,     // live branch to active revision id
                        id : 1234        // branch id, to active revision id. This is created whenever a revision is made at this branch
                    },
                    revisions : [
                        {
                            _id : 555,
                            rev_id : 1234,   // indexed
                            branch_id : id,  // indexed
                            active : 1,      // will be 0 if this market is deleted/deactivated
                            path : 'path/to/your/sub/page',
                            redirect_id : 'id'
                        }
                    ]
                }
            ],
            users : [{}], // (inherits users), will include folders, and fields just as in the parrent 'app' document
            folders : [
                {
                    branches : { 
                        live : 1234,     // live branch to active revision id
                        id : 1234        // branch id, to active revision id. This is created whenever a revision is made at this branch
                    },
                    revisions : [
                        {
                            _id : 555,
                            rev_id : 1234,   // indexed
                            branch_id : id,  // indexed
                            active : 1,      // will be 0 if this market is deleted/deactivated                           
                            short_name : 'my_articles', // strictly enforced to be url/code friendly
                            full_name : 'My Articles'  // May be visually used in the front end
                        }
                    ]
                }
            ],
            fields : [
                {
                    branches : { 
                        live : 1234,     // live branch to active revision id
                        id : 1234        // branch id, to active revision id. This is created whenever a revision is made at this branch
                    },
                    revisions : [
                        {
                            _id : 555,
                            rev_id : 1234,   // indexed
                            branch_id : id,  // indexed
                            active : 1,      // will be 0 if this market is deleted/deactivated
                            short_name : 'title_of_the_article', // strictly enforced to be url/code friendly
                            full_name : 'Title of the article'
                        }
                    ]
                }
            ],
            branches : [
                {
                    branches : { 
                        live : 1234,     // live branch to active revision id
                        id : 1234        // branch id, to active revision id. This is created whenever a revision is made at this branch
                    },
                    revisions : [
                        {
                            _id : 555,
                            rev_id : 1234,   // indexed
                            branch_id : id,  // indexed
                            active : 1,      // will be 0 if this market is deleted/deactivated
                            short_name : 'uat', // strictly enforced to be url friendly
                            full_name : 'User Acceptance Testing'
                        }
                    ]
                }
            ]
        } // close of this app
    ] // close of apps
} // close of c4

/*
Url structure (best practices observed):
    language.domain.market/smart_path/smart_path/entry.format
    
    language - blank or www for default. en, gb, fr, etc for other languages
    domain - the mark of your brand
    market - the .com, .co.uk etc, is used to distinguish markets for your company
    smart_path - automatically generated paths and aliases
    entry - a url_title for a specific field or folder entry
    format - html (default), xml, css, json, jsonp, rss
*/