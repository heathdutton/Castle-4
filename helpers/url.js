/**
 * URL - Helper
 * 
 * To determine what the user is trying to find
 * 
 */
 
/**
 * this is for additional handling, on top of the built-in url parser
 */
exports.parse = function(url){
	globals.c4.load(['core/url']);
	var parsed = globals.c4.core.url.parse(url);
	parsed.segments = parsed.pathname.split('/');
	return parsed;
};