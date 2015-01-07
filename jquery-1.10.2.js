/* jQuery JavaScript Library v1.10.2
* http://jquery.com/
*
* Includes Sizzle.js
* http://sizzlejs.com/
*
* Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
* Released under the MIT license
* http://jquery.org/license
*
* Date: 2013-07-03T13:48Z
*/
(function( window, undefined ) {
// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
// The deferred used on DOM ready
readyList,
// A central reference to the root jQuery(document)
rootjQuery,
// Support: IE<10
// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
core_strundefined = typeof undefined,
// Use the correct document accordingly with window argument (sandbox)
location = window.location,
document = window.document,
docElem = document.documentElement,
// Map over jQuery in case of overwrite
_jQuery = window.jQuery,
// Map over the $ in case of overwrite
_$ = window.$,
// [[Class]] -> type pairs
class2type = {},
// List of deleted data cache ids, so we can reuse them
core_deletedIds = [],
core_version = "1.10.2",
// Save a reference to some core methods
core_concat = core_deletedIds.concat,
core_push = core_deletedIds.push,
core_slice = core_deletedIds.slice,
core_indexOf = core_deletedIds.indexOf,
core_toString = class2type.toString,
core_hasOwn = class2type.hasOwnProperty,
core_trim = core_version.trim,
// Define a local copy of jQuery
jQuery = function( selector, context ) {
// The jQuery object is actually just the init constructor 'enhanced'
return new jQuery.fn.init( selector, context, rootjQuery );
},
// Used for matching numbers
core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
// Used for splitting on whitespace
core_rnotwhite = /\S+/g,
// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
// A simple way to check for HTML strings
// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
// Strict HTML recognition (#11290: must start with <)
rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
// Match a standalone tag
rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
// JSON RegExp
rvalidchars = /^[\],:{}\s]*$/,
rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
// Matches dashed string for camelizing
rmsPrefix = /^-ms-/,
rdashAlpha = /-([\da-z])/gi,
// Used by jQuery.camelCase as callback to replace()
fcamelCase = function( all, letter ) {
return letter.toUpperCase();
},
// The ready event handler
completed = function( event ) {
// readyState === "complete" is good enough for us to call the dom ready in oldIE
if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
detach();
jQuery.ready();
}
},
// Clean-up method for dom ready events
detach = function() {
if ( document.addEventListener ) {
document.removeEventListener( "DOMContentLoaded", completed, false );
window.removeEventListener( "load", completed, false );
} else {
document.detachEvent( "onreadystatechange", completed );
window.detachEvent( "onload", completed );
}
};
jQuery.fn = jQuery.prototype = {
// The current version of jQuery being used
jquery: core_version,
constructor: jQuery,
init: function( selector, context, rootjQuery ) {
var match, elem;
// HANDLE: $(""), $(null), $(undefined), $(false)
if ( !selector ) {
return this;
}
// Handle HTML strings
if ( typeof selector === "string" ) {
if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
// Assume that strings that start and end with <> are HTML and skip the regex check
match = [ null, selector, null ];
} else {
match = rquickExpr.exec( selector );
}
// Match html or make sure no context is specified for #id
if ( match && (match[1] || !context) ) {
// HANDLE: $(html) -> $(array)
if ( match[1] ) {
context = context instanceof jQuery ? context[0] : context;
// scripts is true for back-compat
jQuery.merge( this, jQuery.parseHTML(
match[1],
context && context.nodeType ? context.ownerDocument || context : document,
true
) );
// HANDLE: $(html, props)
if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
for ( match in context ) {
// Properties of context are called as methods if possible
if ( jQuery.isFunction( this[ match ] ) ) {
this[ match ]( context[ match ] );
// ...and otherwise set as attributes
} else {
this.attr( match, context[ match ] );
}
}
}
return this;
// HANDLE: $(#id)
} else {
elem = document.getElementById( match[2] );
// Check parentNode to catch when Blackberry 4.6 returns
// nodes that are no longer in the document #6963
if ( elem && elem.parentNode ) {
// Handle the case where IE and Opera return items
// by name instead of ID
if ( elem.id !== match[2] ) {
return rootjQuery.find( selector );
}
// Otherwise, we inject the element directly into the jQuery object
this.length = 1;
this[0] = elem;
}
this.context = document;
this.selector = selector;
return this;
}
// HANDLE: $(expr, $(...))
} else if ( !context || context.jquery ) {
return ( context || rootjQuery ).find( selector );
// HANDLE: $(expr, context)
// (which is just equivalent to: $(context).find(expr)
} else {
return this.constructor( context ).find( selector );
}
// HANDLE: $(DOMElement)
} else if ( selector.nodeType ) {
this.context = this[0] = selector;
this.length = 1;
return this;
// HANDLE: $(function)
// Shortcut for document ready
} else if ( jQuery.isFunction( selector ) ) {
return rootjQuery.ready( selector );
}
if ( selector.selector !== undefined ) {
this.selector = selector.selector;
this.context = selector.context;
}
return jQuery.makeArray( selector, this );
},
// Start with an empty selector
selector: "",
// The default length of a jQuery object is 0
length: 0,
toArray: function() {
return core_slice.call( this );
},
// Get the Nth element in the matched element set OR
// Get the whole matched element set as a clean array
get: function( num ) {
return num == null ?
// Return a 'clean' array
this.toArray() :
// Return just the object
( num < 0 ? this[ this.length + num ] : this[ num ] );
},
// Take an array of elements and push it onto the stack
// (returning the new matched element set)
pushStack: function( elems ) {
// Build a new jQuery matched element set
var ret = jQuery.merge( this.constructor(), elems );
// Add the old object onto the stack (as a reference)
ret.prevObject = this;
ret.context = this.context;
// Return the newly-formed element set
return ret;
},
// Execute a callback for every element in the matched set.
// (You can seed the arguments with an array of args, but this is
// only used internally.)
each: function( callback, args ) {
return jQuery.each( this, callback, args );
},
ready: function( fn ) {
// Add the callback
jQuery.ready.promise().done( fn );
return this;
},
slice: function() {
return this.pushStack( core_slice.apply( this, arguments ) );
},
first: function() {
return this.eq( 0 );
},
last: function() {
return this.eq( -1 );
},
eq: function( i ) {
var len = this.length,
j = +i + ( i < 0 ? len : 0 );
return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
},
map: function( callback ) {
return this.pushStack( jQuery.map(this, function( elem, i ) {
return callback.call( elem, i, elem );
}));
},
end: function() {
return this.prevObject || this.constructor(null);
},
// For internal use only.
// Behaves like an Array's method, not like a jQuery method.
push: core_push,
sort: [].sort,
splice: [].splice
};
// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;
jQuery.extend = jQuery.fn.extend = function() {
var src, copyIsArray, copy, name, options, clone,
target = arguments[0] || {},
i = 1,
length = arguments.length,
deep = false;
// Handle a deep copy situation
if ( typeof target === "boolean" ) {
deep = target;
target = arguments[1] || {};
// skip the boolean and the target
i = 2;
}
// Handle case when target is a string or something (possible in deep copy)
if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
target = {};
}
// extend jQuery itself if only one argument is passed
if ( length === i ) {
target = this;
--i;
}
for ( ; i < length; i++ ) {
// Only deal with non-null/undefined values
if ( (options = arguments[ i ]) != null ) {
// Extend the base object
for ( name in options ) {
src = target[ name ];
copy = options[ name ];
// Prevent never-ending loop
if ( target === copy ) {
continue;
}
// Recurse if we're merging plain objects or arrays
if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
if ( copyIsArray ) {
copyIsArray = false;
clone = src && jQuery.isArray(src) ? src : [];
