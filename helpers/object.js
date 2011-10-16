/**
 * object handlers
 */
 
 
/*
* recursively merge properties of two objects 
*/
exports.merge = function(obj1, obj2) {
    for (var p in obj2) {
        try {
            // Property in destination object set; update its value.
            if (obj2[p].constructor == Object) {
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
};

/**
 * Concatenates the values of a variable into an easily readable string
 * by Matt Hackett [scriptnode.com]
 * @param {Object} x The variable to debug
 * @param {Number} max The maximum number of recursions allowed (keep low, around 5 for HTML elements to prevent errors) [default: 10]
 * @param {String} sep The separator to use between [default: a single space ' ']
 * @param {Number} l The current level deep (amount of recursion). Do not use this parameter: it's for the function's own use
 */
exports.print_r = function(x, max, sep, l) {
    l = l || 0;
    max = max || 10;
    sep = sep || ' ';

    if (l > max) {
        return "[WARNING: Too much recursion]\n";
    }

    var
    i,
    r = '',
    t = typeof x,
    tab = '';

    if (x === null) {
        r += "(null)\n";
    } else if (t == 'object') {

        l++;

        for (i = 0; i < l; i++) {
            tab += sep;
        }

        if (x && x.length) {
            t = 'array';
        }

        r += '(' + t + ") :\n";

        for (i in x) {
            try {
                r += tab + '[' + i + '] : ' + global.c4.helpers.object.print_r(x[i], max, sep, (l + 1));
            } catch(e) {
                return "[ERROR: " + e + "]\n";
            }
        }

    } else {

        if (t == 'string') {
            if (x == '') {
                x = '(empty)';
            }
        }

        r += '(' + t + ') ' + x + "\n";

    }

    return r;
};

// Array/obj dump
exports.dump = function(arr, level) {
    var output = '',
    pad_char = ' ',
    pad_val = 4,
    lgth = 0,
    i = 0;
    var _getFuncName = function (fn) {
        var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
        if (!name) {
            return '(Anonymous)';
        }
        return name[1];
    };	 
    var _repeat_char = function (len, pad_char) {
        var str = '';
        for (var i = 0; i < len; i++) {
            str += pad_char;
        }
        return str;
    };
    var _getInnerVal = function (val, thick_pad) {
        var ret = '';
        if (val === null) {
            ret = 'NULL';
        } else if (typeof val === 'boolean') {
            ret = 'bool(' + val + ')';
        } else if (typeof val === 'string') {
            ret = 'string(' + val.length + ') "' + val + '"';
        } else if (typeof val === 'number') {
            if (parseFloat(val) == parseInt(val, 10)) {
                ret = 'int(' + val + ')';
            } else {
                ret = 'float(' + val + ')';
            }
        }
        // The remaining are not PHP behavior because these values only exist in this exact form in JavaScript
        else if (typeof val === 'undefined') {
            ret = 'undefined';
        } else if (typeof val === 'function') {
            var funcLines = val.toString().split('\n');
            ret = '';
            for (var i = 0, fll = funcLines.length; i < fll; i++) {
                ret += (i !== 0 ? '\n' + thick_pad : '') + funcLines[i];
            }
        } else if (val instanceof Date) {
            ret = 'Date(' + val + ')';
        } else if (val instanceof RegExp) {
            ret = 'RegExp(' + val + ')';
        } else if (val.nodeName) { // Different than PHP's DOMElement
            switch (val.nodeType) {
                case 1:
                    if (typeof val.namespaceURI === 'undefined' || val.namespaceURI === 'http://www.w3.org/1999/xhtml') { // Undefined namespace could be plain XML, but namespaceURI not widely supported
                        ret = 'HTMLElement("' + val.nodeName + '")';
                    } else {
                        ret = 'XML Element("' + val.nodeName + '")';
                    }
                    break;
                case 2:
                    ret = 'ATTRIBUTE_NODE(' + val.nodeName + ')';
                    break;
                case 3:
                    ret = 'TEXT_NODE(' + val.nodeValue + ')';
                    break;
                case 4:
                    ret = 'CDATA_SECTION_NODE(' + val.nodeValue + ')';
                    break;
                case 5:
                    ret = 'ENTITY_REFERENCE_NODE';
                    break;
                case 6:
                    ret = 'ENTITY_NODE';
                    break;
                case 7:
                    ret = 'PROCESSING_INSTRUCTION_NODE(' + val.nodeName + ':' + val.nodeValue + ')';
                    break;
                case 8:
                    ret = 'COMMENT_NODE(' + val.nodeValue + ')';
                    break;
                case 9:
                    ret = 'DOCUMENT_NODE';
                    break;
                case 10:
                    ret = 'DOCUMENT_TYPE_NODE';
                    break;
                case 11:
                    ret = 'DOCUMENT_FRAGMENT_NODE';
                    break;
                case 12:
                    ret = 'NOTATION_NODE';
                    break;
            }
        }
        return ret;
    };	 
    var _formatArray = function (obj, cur_depth, pad_val, pad_char) {
        var someProp = '';
        if (cur_depth > 0) {
            cur_depth++;
        }
 
        var base_pad = _repeat_char(pad_val * (cur_depth - 1), pad_char);
        var thick_pad = _repeat_char(pad_val * (cur_depth + 1), pad_char);
        var str = '';
        var val = '';
 
        if (typeof obj === 'object' && obj !== null) {
            if (obj.constructor && _getFuncName(obj.constructor) === 'PHPJS_Resource') {
                return obj.var_dump();
            }
            lgth = 0;
            for (someProp in obj) {
                lgth++;
            }
            str += 'array(' + lgth + ') {\n';
            for (var key in obj) {
                var objVal = obj[key];
                if (typeof objVal === 'object' && objVal !== null && !(objVal instanceof Date) && !(objVal instanceof RegExp) && !objVal.nodeName) {
                    str += thick_pad + '[' + key + '] =>\n' + thick_pad + _formatArray(objVal, cur_depth + 1, pad_val, pad_char);
                } else {
                    val = _getInnerVal(objVal, thick_pad);
                    str += thick_pad + '[' + key + '] =>\n' + thick_pad + val + '\n';
                }
            }
            str += base_pad + '}\n';
        } else {
            str = _getInnerVal(obj, thick_pad);
        }
        return str;
    };	 
    output = _formatArray(arguments[0], 0, pad_val, pad_char);
    for (i = 1; i < arguments.length; i++) {
        output += '\n' + _formatArray(arguments[i], 0, pad_val, pad_char);
    }
    return output;
//console.log('Variable Dump: ' + output);
};