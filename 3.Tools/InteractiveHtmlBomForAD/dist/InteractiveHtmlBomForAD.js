var CURRENT_PATH = "E:\\00ADlib\\ADLib\\3.Tools\\InteractiveHtmlBomForAD\\";

//  json2.js
//  2017-06-12
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.

//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.

//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.

//          For example, this would serialize Dates as ISO strings.

//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };

//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.

//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.

//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.

//          JSON.stringify(undefined) returns undefined.

//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.

//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.

//          Example:

//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'

//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'

//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.

//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.

//          Example:

//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.

//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(
//                         +a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]
//                      ));
//                  }
//                  return value;
//              }
//          });

//          myData = JSON.parse(
//              "[\"Date(09/09/2001)\"]",
//              function (key, value) {
//                  var d;
//                  if (
//                      typeof value === "string"
//                      && value.slice(0, 5) === "Date("
//                      && value.slice(-1) === ")"
//                  ) {
//                      d = new Date(value.slice(5, -1));
//                      if (d) {
//                          return d;
//                      }
//                  }
//                  return value;
//              }
//          );

//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.

/*jslint
    eval, for, this
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.


// source link : https://github.com/douglascrockford/JSON-js

// slightly modified to be compatible with AD.  

function initJSON(non) {
    //"use strict";

    var JSON = {};
    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return (n < 10)
            ? "0" + n
            : n;
    }

    function this_value(non) {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {

        Date.prototype.toJSON = function anonymFun2JSON(non) {

            return isFinite(this.valueOf())
                ? (
                    this.getUTCFullYear()
                    + "-"
                    + f(this.getUTCMonth() + 1)
                    + "-"
                    + f(this.getUTCDate())
                    + "T"
                    + f(this.getUTCHours())
                    + ":"
                    + f(this.getUTCMinutes())
                    + ":"
                    + f(this.getUTCSeconds())
                    + "Z"
                )
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string)
            ? "\"" + string.replace(rx_escapable, function anonymFun(a) {
                var c = meta[a];
                return typeof c === "string"
                    ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\""
            : "\"" + string + "\"";
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i;          // The loop counter.
        var k;          // The member key.
        var v;          // The member value.
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (
            value
            && typeof value === "object"
            && typeof value.toJSON === "function"
        ) {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case "string":
            return quote(value);

        case "number":

// JSON numbers must be finite. Encode non-finite numbers as null.

            return (isFinite(value))
                ? String(value)
                : "null";

        case "boolean":
        case "null":

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce "null". The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is "object", we might be dealing with an object or an array or
// null.

        case "object":

// Due to a specification blunder in ECMAScript, typeof null is "object",
// so watch out for that case.

            if (!value) {
                return "null";
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === "[object Array]") {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null";
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? "[]"
                    : gap
                        ? (
                            "[\n"
                            + gap
                            + partial.join(",\n" + gap)
                            + "\n"
                            + mind
                            + "]"
                        )
                        : "[" + partial.join(",") + "]";
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === "string") {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                (gap)
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                (gap)
                                    ? ": "
                                    : ":"
                            ) + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? "{}"
                : gap
                    ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
                    : "{" + partial.join(",") + "}";
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== "function") {
        meta = {    // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function anonymFunStringify(value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = "";
            indent = "";

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === "string") {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== "function" && (
                typeof replacer !== "object"
                || typeof replacer.length !== "number"
            )) {
                throw new Error("JSON.stringify");
            }

// Make a fake root object containing our value under the key of "".
// Return the result of stringifying the value.

            return str("", {"": value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== "function") {
        JSON.parse = function anonymFunParse(text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k;
                var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function anonymFun2(a) {
                    return (
                        "\\u"
                        + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                    );
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with "()" and "new"
// because they can cause invocation, and "=" because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
// replace all simple value tokens with "]" characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or "]" or
// "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                        .replace(rx_two, "@")
                        .replace(rx_three, "]")
                        .replace(rx_four, "")
                )
            ) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The "{" operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval("(" + text + ")");

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return (typeof reviver === "function")
                    ? walk({"": j}, "")
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError("JSON.parse");
        };
    }
    return JSON;
};

var JSON = initJSON();
// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
// 
// 
// source link : https://github.com/pieroxy/lz-string
// slightly modified to be compatible with AD.  

function LZString(non) {
// private property
  var f = String.fromCharCode;
  var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; 

  function compressToBase64(input) {
    if (input == null) return "";
    var res = _compress(input, 6, function anonymFun(a){return keyStrBase64.charAt(a);});
    switch (res.length % 4) { // To produce valid Base64
    default: // When could this happen ?
    case 0 : return res;
    case 1 : return res+"===";
    case 2 : return res+"==";
    case 3 : return res+"=";
    }
  }

  function _compress (uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return "";
    var i, value,
        context_dictionary= {},
        context_dictionaryToCreate= {},
        context_c="",
        context_wc="",
        context_w="",
        context_enlargeIn= 2, // Compensate for the first entry which should not count
        context_dictSize= 3,
        context_numBits= 2,
        context_data=[],
        context_data_val=0,
        context_data_position=0,
        ii; 

    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      } 

      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
          if (context_w.charCodeAt(0)<256) {
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<8 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position ==bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<16 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          } 
  

        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        // Add wc to the dictionary.
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    } 

    // Output the code for w.
    if (context_w !== "") {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
        if (context_w.charCodeAt(0)<256) {
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<8 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<16 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i=0 ; i<context_numBits ; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        } 
  

      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    } 

    // Mark the end of the stream
    value = 2;
    for (i=0 ; i<context_numBits ; i++) {
      context_data_val = (context_data_val << 1) | (value&1);
      if (context_data_position == bitsPerChar-1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else {
        context_data_position++;
      }
      value = value >> 1;
    } 

    // Flush the last char
    while (true) {
      context_data_val = (context_data_val << 1);
      if (context_data_position == bitsPerChar-1) {
        context_data.push(getCharFromInt(context_data_val));
        break;
      }
      else context_data_position++;
    }
    return context_data.join('');
  } 

  var LZString = {
    "compressToBase64" : compressToBase64
  };
    return LZString;
  }

var LZStr = LZString();

// if (typeof define === 'function' && define.amd) {
//   define(function () { return LZString; });
// } else if( typeof module !== 'undefined' && module != null ) {
//   module.exports = LZString
// } else if( typeof angular !== 'undefined' && angular != null ) {
//   angular.module('LZString', [])
//   .factory('LZString', function () {
//     return LZString;
//   });
// }

function getConfig(non) {
	var config = {};

	config["htmlConfig"] = {
		"redraw_on_drag": true,
		"bom_view": "left-right", 
		"layer_view": "FB",
		"show_silkscreen": true,
		"checkboxes": "Sourced,Placed", 
		"dark_mode": false,
		"highlight_pin1": false, 
		"show_pads": true,
		"show_fabrication": false, 
		"extra_fields": [], 
		// "extra_fields": ["PartNum"],   //add ibom html column
		"board_rotation": 0
	};

	config["include"] = {
		"tracks": false, // not support arc for now, so parse one arc to a few tracks. slow.
		"vias": false,  // so many objects in pcbdata slow down the speed of generating bom.
		"nets": false,
		"polys": false, 
		"polyHatched": false  // a group of tracks and arcs( arc to tracks), very slow.
	};

	return config;
} 

var config = getConfig();
/// newstroke_font.js
/*
 * newstroke_font.cpp - definitions for automatically converted font
 *
 * This program source code file is part of KiCad, a free EDA CAD application.
 *
 * Copyright (C) 2010 vladimir uryvaev <vovanius@bk.ru>
 * Copyright (C) 1992-2010 KiCad Developers, see change_log.txt for contributors.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, you may find one here:
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * or you may search the http://www.gnu.org website for the version 2 license,
 * or you may write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA

#include <newstroke_font.h>

This file is copied from KiCad source tree and
slightly modified to be valid python by qu1ck.
*/
// modified to be valid to js.
function get_newstroke_font (non) {
    var NEWSTROKE_FONT
            = ["JZ","MWRYSZR[QZRYR[ RRSQGRFSGRSRF","JZNFNJ RVFVJ","H]LM[M RRDL_ RYVJV RS_YD","H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RRCR^","F^J[ZF RMFOGPIOKMLKKJIKGMF RYZZXYVWUUVTXUZW[YZ","E_[[Z[XZUWPQNNMKMINGPFQFSGTITJSLRMLQKRJTJWKYLZN[Q[SZTYWUXRXP","MWSFQJ","KYVcUbS_R]QZPUPQQLRISGUDVC","KYNcObQ_R]SZTUTQSLRIQGODNC","JZRFRK RMIRKWI ROORKUO","E_JSZS RR[RK","MWSZS[R]Q^","E_JSZS","MWRYSZR[QZRYR[","G][EI`","H\\QFSFUGVHWJXNXSWWVYUZS[Q[OZNYMWLSLNMJNHOGQF","H\\X[L[ RR[RFPINKLL","H\\LHMGOFTFVGWHXJXLWOK[X[",
            "H\\KFXFQNTNVOWPXRXWWYVZT[N[LZKY","H\\VMV[ RQELTYT","H\\WFMFLPMOONTNVOWPXRXWWYVZT[O[MZLY","H\\VFRFPGOHMKLOLWMYNZP[T[VZWYXWXRWPVOTNPNNOMPLR","H\\KFYFP[","H\\PONNMMLKLJMHNGPFTFVGWHXJXKWMVNTOPONPMQLSLWMYNZP[T[VZWYXWXSWQVPTO","H\\N[R[TZUYWVXRXJWHVGTFPFNGMHLJLOMQNRPSTSVRWQXO","MWRYSZR[QZRYR[ RRNSORPQORNRP","MWSZS[R]Q^ RRNSORPQORNRP","E_ZMJSZY","E_JPZP RZVJV","E_JMZSJY","I[QYRZQ[PZQYQ[ RMGOFTFVGWIWKVMUNSORPQRQS","D_VQUPSOQOOPNQMSMUNWOXQYSYUXVW RVOVWWXXXZW[U[PYMVKRJNKKMIPHTIXK[N]R^V]Y[","I[MUWU RK[RFY[",
            "G\\SPVQWRXTXWWYVZT[L[LFSFUGVHWJWLVNUOSPLP","F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH","G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[","H[MPTP RW[M[MFWF","HZTPMP RM[MFWF","F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR","G]L[LF RLPXP RX[XF","MWR[RF","JZUFUUTXRZO[M[","G\\L[LF RX[OO RXFLR","HYW[M[MF","F^K[KFRUYFY[","G]L[LFX[XF","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF","G\\L[LFTFVGWHXJXMWOVPTQLQ","G]Z]X\\VZSWQVOV RP[NZLXKTKMLINGPFTFVGXIYMYTXXVZT[P[","G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ","H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG",
            "JZLFXF RR[RF","G]LFLWMYNZP[T[VZWYXWXF","I[KFR[YF","F^IFN[RLV[[F","H\\KFY[ RYFK[","I[RQR[ RKFRQYF","H\\KFYFK[Y[","KYVbQbQDVD","KYID[_","KYNbSbSDND","LXNHREVH","JZJ]Z]","NVPESH","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR","H[M[MF RMNOMSMUNVOWQWWVYUZS[O[MZ","HZVZT[P[NZMYLWLQMONNPMTMVN","I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN","I[VZT[P[NZMXMPNNPMTMVNWPWRMT","MYOMWM RR[RISGUFWF","I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN","H[M[MF RV[VPUNSMPMNNMO","MWR[RM RRFQGRHSGRFRH","MWRMR_QaObNb RRFQGRHSGRFRH",
            "IZN[NF RPSV[ RVMNU","MXU[SZRXRF","D`I[IM RIOJNLMOMQNRPR[ RRPSNUMXMZN[P[[","I\\NMN[ RNOONQMTMVNWPW[","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[","H[MMMb RMNOMSMUNVOWQWWVYUZS[O[MZ","I\\WMWb RWZU[Q[OZNYMWMQNOONQMUMWN","KXP[PM RPQQORNTMVM","J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN","MYOMWM RRFRXSZU[W[","H[VMV[ RMMMXNZP[S[UZVY","JZMMR[WM","G]JMN[RQV[ZM","IZL[WM RLMW[","JZMMR[ RWMR[P`OaMb","IZLMWML[W[","KYVcUcSbR`RVQTOSQRRPRFSDUCVC","H\\RbRD","KYNcOcQbR`RVSTUSSRRPRFQDOCNC","KZMSNRPQTSVRWQ","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","JZ",
            "MWROQNRMSNRORM RRUSaRbQaRURb","HZVZT[P[NZMYLWLQMONNPMTMVN RRJR^","H[LMTM RL[W[ RO[OIPGRFUFWG","H]LYOV RLLOO RVVYY RVOYL RVVTWQWOVNTNQOOQNTNVOWQWTVV","F^JTZT RJMZM RRQR[ RKFRQYF","MWRbRW RRFRQ","I[N]P^S^U]V[UYOSNQNPONQM RVGTFQFOGNIOKUQVSVTUVSW","LXNFOGNHMGNFNH RVFWGVHUGVFVH","@dVKTJPJNKLMKOKSLUNWPXTXVW RRCMDHGELDQEVH[M^R_W^\\[_V`Q_L\\GWDRC","KZOEQDSDUEVGVN RVMTNQNOMNKOIQHVH","H\\RMLSRY RXWTSXO","E_JQZQZV","RR","@dWXRR RNXNJTJVKWMWOVQTRNR RRCMDHGELDQEVH[M^R_W^\\[_V`Q_L\\GWDRC","LXMGWG",
            "JZRFPGOIPKRLTKUITGRF","E_JOZO RRWRG RZ[J[","JZNAP@S@UAVCVEUGNNVN","JZN@V@RESEUFVHVKUMSNPNNM","NVTEQH","H^MMMb RWXXZZ[ RMXNZP[T[VZWXWM","F]VMV[ ROMOXNZL[ RZMMMKNJP","JZRRQSRTSSRRRT","MWR\\T]U_TaRbOb","JZVNNN RNCPBR@RN","KYQNOMNKNGOEQDSDUEVGVKUMSNQN","H\\RMXSRY RLWPSLO","G]KQYQ RVNNN RNCPBR@RN RUYUa RQSN]W]","G]KQYQ RVNNN RNCPBR@RN RNTPSSSUTVVVXUZNaVa","G]KQYQ RN@V@RESEUFVHVKUMSNPNNM RUYUa RQSN]W]","I[SORNSMTNSOSM RWaUbPbNaM_M]N[OZQYRXSVSU","I[MUWU RK[RFY[ RP>SA","I[MUWU RK[RFY[ RT>QA",
            "I[MUWU RK[RFY[ RNAR>VA","I[MUWU RK[RFY[ RMAN@P?TAV@W?","I[MUWU RK[RFY[ RN?O@NAM@N?NA RV?W@VAU@V?VA","I[MUWU RK[RFY[ RRFPEOCPAR@TAUCTERF","F`JURU RRPYP RH[OF\\F RRFR[\\[","F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RR\\T]U_TaRbOb","H[MPTP RW[M[MFWF RP>SA","H[MPTP RW[M[MFWF RT>QA","H[MPTP RW[M[MFWF RNAR>VA","H[MPTP RW[M[MFWF RN?O@NAM@N?NA RV?W@VAU@V?VA","MWR[RF RP>SA","MWR[RF RT>QA","MWR[RF RNAR>VA","MWR[RF RN?O@NAM@N?NA RV?W@VAU@V?VA","G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[ RIPQP","G]L[LFX[XF RMAN@P?TAV@W?",
            "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RP>SA","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RT>QA","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RNAR>VA","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RMAN@P?TAV@W?","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RN?O@NAM@N?NA RV?W@VAU@V?VA","E_LMXY RXMLY","G]ZFJ[ RP[NZLXKTKMLINGPFTFVGXIYMYTXXVZT[P[","G]LFLWMYNZP[T[VZWYXWXF RP>SA","G]LFLWMYNZP[T[VZWYXWXF RT>QA","G]LFLWMYNZP[T[VZWYXWXF RNAR>VA","G]LFLWMYNZP[T[VZWYXWXF RN?O@NAM@N?NA RV?W@VAU@V?VA","I[RQR[ RKFRQYF RT>QA",
            "G\\LFL[ RLKTKVLWMXOXRWTVUTVLV","F]K[KJLHMGOFRFTGUHVJVMSMQNPPPQQSSTVTXUYWYXXZV[R[PZ","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RPESH","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RTEQH","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNHREVH","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RMHNGPFTHVGWF","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNFOGNHMGNFNH RVFWGVHUGVFVH","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RRHPGOEPCRBTCUETGRH","D`INKMOMQNRP R[ZY[U[SZRXRPSNUMYM[N\\P\\RRSKSITHVHXIZK[O[QZRX",
            "HZVZT[P[NZMYLWLQMONNPMTMVN RR\\T]U_TaRbOb","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RPESH","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RTEQH","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNHREVH","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNFOGNHMGNFNH RVFWGVHUGVFVH","MWR[RM RPESH","MWR[RM RTEQH","LXNHREVH RR[RM","LXNFOGNHMGNFNH RVFWGVHUGVFVH RR[RM","I\\SCQI RWNUMQMONNOMQMXNZP[T[VZWXWLVITGRFNE","I\\NMN[ RNOONQMTMVNWPW[ RMHNGPFTHVGWF","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RPESH","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RTEQH",
            "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNHREVH","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RMHNGPFTHVGWF","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNFOGNHMGNFNH RVFWGVHUGVFVH","E_ZSJS RRXSYRZQYRXRZ RRLSMRNQMRLRN","H[XMK[ RP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[","H[VMV[ RMMMXNZP[S[UZVY RPESH","H[VMV[ RMMMXNZP[S[UZVY RTEQH","H[VMV[ RMMMXNZP[S[UZVY RNHREVH","H[VMV[ RMMMXNZP[S[UZVY RNFOGNHMGNFNH RVFWGVHUGVFVH","JZMMR[ RWMR[P`OaMb RTEQH","H[MFMb RMNOMSMUNVOWQWWVYUZS[O[MZ","JZMMR[ RWMR[P`OaMb RNFOGNHMGNFNH RVFWGVHUGVFVH",
            "I[MUWU RK[RFY[ RM@W@","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RMGWG","I[MUWU RK[RFY[ RN>O@QASAU@V>","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNEOGQHSHUGVE","I[MUWU RK[RFY[ RY[W]V_WaYb[b","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RW[U]T_UaWbYb","F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RT>QA","HZVZT[P[NZMYLWLQMONNPMTMVN RTEQH","F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RNAR>VA","HZVZT[P[NZMYLWLQMONNPMTMVN RNHREVH","F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RR?Q@RAS@R?RA","HZVZT[P[NZMYLWLQMONNPMTMVN RRFQGRHSGRFRH",
            "F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RN>RAV>","HZVZT[P[NZMYLWLQMONNPMTMVN RNERHVE","G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[ RN>RAV>","IfW[WF RWZU[Q[OZNYMWMQNOONQMUMWN RbF`J","G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[ RIPQP","I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN RRHZH","H[MPTP RW[M[MFWF RM@W@","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RMGWG","H[MPTP RW[M[MFWF RN>O@QASAU@V>","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNEOGQHSHUGVE","H[MPTP RW[M[MFWF RR?Q@RAS@R?RA","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RRFQGRHSGRFRH","H[MPTP RW[M[MFWF RR[P]O_PaRbTb",
            "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RR[P]O_PaRbTb","H[MPTP RW[M[MFWF RN>RAV>","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNERHVE","F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RNAR>VA","I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN RNHREVH","F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RN>O@QASAU@V>","I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN RNEOGQHSHUGVE","F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RR?Q@RAS@R?RA","I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN RRFQGRHSGRFRH","F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RR\\T]U_TaRbOb",
            "I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN RRGPFODPBRAUA","G]L[LF RLPXP RX[XF RNAR>VA","H[M[MF RV[VPUNSMPMNNMO RIAM>QA","G]IJ[J RL[LF RLPXP RX[XF","H[M[MF RV[VPUNSMPMNNMO RJHRH","MWR[RF RMAN@P?TAV@W?","MWR[RM RMHNGPFTHVGWF","MWR[RF RM@W@","MWR[RM RMGWG","MWR[RF RN>O@QASAU@V>","MWR[RM RNEOGQHSHUGVE","MWR[RF RR[P]O_PaRbTb","MWR[RM RR[P]O_PaRbTb","MWR[RF RR?Q@RAS@R?RA","MWR[RM","MgR[RF RbFbUaX_Z\\[Z[","MaR[RM RRFQGRHSGRFRH R\\M\\_[aYbXb R\\F[G\\H]G\\F\\H","JZUFUUTXRZO[M[ RQAU>YA","MWRMR_QaObNb RNHREVH",
            "G\\L[LF RX[OO RXFLR RR\\T]U_TaRbOb","IZN[NF RPSV[ RVMNU RR\\T]U_TaRbOb","IZNMN[ RPSV[ RVMNU","HYW[M[MF RO>LA","MXU[SZRXRF RTEQH","HYW[M[MF RR\\T]U_TaRbOb","MXU[SZRXRF RR\\T]U_TaRbOb","HYW[M[MF RVHSK","M^U[SZRXRF RZFXJ","HYW[M[MF RUNTOUPVOUNUP","M\\U[SZRXRF RYOZPYQXPYOYQ","HYW[M[MF RJQPM","MXU[SZRXRF ROQUM","G]L[LFX[XF RT>QA","I\\NMN[ RNOONQMTMVNWPW[ RTEQH","G]L[LFX[XF RR\\T]U_TaRbOb","I\\NMN[ RNOONQMTMVNWPW[ RR\\T]U_TaRbOb","G]L[LFX[XF RN>RAV>","I\\NMN[ RNOONQMTMVNWPW[ RNERHVE",
            "MjSFQJ R\\M\\[ R\\O]N_MbMdNePe[","G]LFL[ RLINGPFTFVGWHXJX^W`VaTbQb","I\\NMN[ RNOONQMTMVNWPW_VaTbRb","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RM@W@","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RMGWG","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RN>O@QASAU@V>","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNEOGQHSHUGVE","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RQ>NA RX>UA","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RQENH RXEUH","E`RPYP RRFR[ R\\FNFLGJIIMITJXLZN[\\[","C`[ZY[U[SZRXRPSNUMYM[N\\P\\RRT RRQQOPNNMKMINHOGQGWHYIZK[N[PZQYRW",
            "G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ RT>QA","KXP[PM RPQQORNTMVM RTEQH","G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ RR\\T]U_TaRbOb","KXP[PM RPQQORNTMVM RR\\T]U_TaRbOb","G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ RN>RAV>","KXP[PM RPQQORNTMVM RNERHVE","H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RT>QA","J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RTEQH","H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RNAR>VA","J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RNHREVH","H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RR\\T]U_TaRbOb",
            "J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RR\\T]U_TaRbOb","H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RN>RAV>","J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RNERHVE","JZLFXF RR[RF RR\\T]U_TaRbOb","MYOMWM RRFRXSZU[W[ RR\\T]U_TaRbOb","JZLFXF RR[RF RN>RAV>","M[OMWM RYFXI RRFRXSZU[W[","JZLFXF RR[RF RNQVQ","MYOMWM RRFRXSZU[W[ ROSUS","G]LFLWMYNZP[T[VZWYXWXF RMAN@P?TAV@W?","H[VMV[ RMMMXNZP[S[UZVY RMHNGPFTHVGWF","G]LFLWMYNZP[T[VZWYXWXF RM@W@","H[VMV[ RMMMXNZP[S[UZVY RMGWG","G]LFLWMYNZP[T[VZWYXWXF RN>O@QASAU@V>",
            "H[VMV[ RMMMXNZP[S[UZVY RNEOGQHSHUGVE","G]LFLWMYNZP[T[VZWYXWXF RRAP@O>P<R;T<U>T@RA","H[VMV[ RMMMXNZP[S[UZVY RRHPGOEPCRBTCUETGRH","G]LFLWMYNZP[T[VZWYXWXF RQ>NA RX>UA","H[VMV[ RMMMXNZP[S[UZVY RQENH RXEUH","G]LFLWMYNZP[T[VZWYXWXF RR[P]O_PaRbTb","H[VMV[ RMMMXNZP[S[UZVY RV[T]S_TaVbXb","F^IFN[RLV[[F RNAR>VA","G]JMN[RQV[ZM RNHREVH","I[RQR[ RKFRQYF RNAR>VA","JZMMR[ RWMR[P`OaMb RNHREVH","JZLFXF RR[RF RN?O@NAM@N?NA RV?W@VAU@V?VA","H\\KFYFK[Y[ RT>QA","IZLMWML[W[ RTEQH","H\\KFYFK[Y[ RR?Q@RAS@R?RA",
            "IZLMWML[W[ RRFQGRHSGRFRH","H\\KFYFK[Y[ RN>RAV>","IZLMWML[W[ RNERHVE","MYR[RISGUFWF","H[M[MF RMNOMSMUNVOWQWWVYUZS[O[MZ RJHRH","C\\LFL[T[VZWYXWXTWRVQSPLP RFKFIGGIFSFUGVHWJWLVNUOSP","G\\VFLFL[R[UZWXXVXSWQUORNLN","H[WFMFM[ RMNOMSMUNVOWQWWVYUZS[O[MZ","H]MFM[S[VZXXYVYSXQVOSNMN","IZNMN[S[UZVXVUUSSRNR","I^MHNGQFSFVGXIYKZOZRYVXXVZS[Q[NZMY","F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RMHKGJEKCLB","HZVZT[P[NZMYLWLQMONNPMTMVN RTMTIUGWFYF","G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[ RIPQP","C\\FKFIGGIFQFTGVIWKXOXRWVVXTZQ[L[LF",
            "H]NFXFX[R[OZMXLVLSMQOORNXN","I\\MFWFW[ RWNUMQMONNOMQMWNYOZQ[U[WZ","I\\Q[T[VZWYXWXQWOVNTMQMONNOMQMWNYOZQ[T\\V]W_VaTbPbNa","I\\WPPP RM[W[WFMF","F^MHNGQFSFVGXIYKZOZRYVXXVZS[Q[NZLXKVJRZP","G[PPTP RWGUFPFNGMHLJLLMNNOPPMQLRKTKWLYMZO[U[WZ","HZTPMP RM[MFWF RM[M_LaJbHb","MYOMWM RR[RISGUFWF RR[R_QaObMb","F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RMHKGJEKCLB","I[KFU[U_TaRbPaO_O[YF","D`I[IF RIOJNLMOMQNRPRXSZU[X[ZZ[Y\\W\\P[NZM","MZRFRWSYTZV[X[","MWR[RF RNPVP","G_L[LF RX[OO RLRWGYF[G\\I\\K","IZNMN[ RPSV[ RVMNU RNMNIOGQFSF",
            "MXU[SZRXRF RNOVO","JZRMM[ RMFOFPGRMW[ RNLTH","Ca\\F\\[ R\\XZZX[V[TZSYRWRF RRWQYPZN[L[JZIYHWHF","G]L[LFX[XF RL[L_KaIbGb","I\\NMN[ RNOONQMTMVNWPWb","G]KPYP RPFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RVGXFYDXBWA","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RUNWMXKWIVH","DaSGQFMFKGIIHMHTIXKZM[Q[SZUXVTVMUISGUFYF[G\\I\\b","E^RNPMMMKNJOIQIWJYKZM[P[RZSYTWTQSORNTMVMXNYPYb","C\\LFL[ RFKFIGGIFTFVGWHXJXMWOVPTQLQ","H[MMMb RMNOMSMUNVOWQWWVYUZS[O[MZ RRMRISGUFWF",
            "G\\LFL[ RQVXb RLKTKVLWMXOXRWTVUTVLV","H\\XZU[P[NZMYLWLUMSNRPQTPVOWNXLXJWHVGTFOFLG","IZVZT[P[NZMXMWNUPTSTUSVQVPUNSMPMNN","H[W[L[SPLFWF","JYWbUbSaR_RIQGOFMGLIMKOLQKRI","MYOMWM RRFRXSZU[W[ RW[W_VaTbRb","HZR[RF RKKKILGNFXF","MYOMWM RWFUFSGRIRXSZU[W[","JZLFXF RR[RF RR[R_SaUbWb","G]LFLWMYNZP[T[VZWYXWXF RXFZE[CZAY@","H[VMV[ RMMMXNZP[S[UZVY RVMXLYJXHWG","F^ZFUFUJWKYMZPZUYXWZT[P[MZKXJUJPKMMKOJOFJF","G]LFLWMYNZP[T[VZXXYVYIXGWF","I`RQR[ RKFRQXGZF\\G]I]K","J^MMR[ RMbOaP`R[VNXMZN[P[R","H\\KFYFK[Y[ RNPVP",
            "IZLMWML[W[ RNTVT","H\\KFXFQNTNVOWPXRXWWYVZT[N[LZKY","H\\YFLFSNPNNOMPLRLWMYNZP[V[XZYY","JZWMNMUVRVPWOXNZN^O`PaRbUbWa","JZMMVMOTSTUUVWVXUZS[Q[O\\N^N_OaQbVb","H\\LHMGOFTFVGWHXJXLWOK[X[ RNSVS","H\\WFMFLPMOONTNVOWPXRXWWYVZT[O[MZLY","JZVMOMNSPRSRUSVUVXUZS[P[NZ","J^MZP[T[WZYXZVZSYQWOTNPNPF RLITI","H[MMMb RMONNPMTMVNWPWSVUM^","MWRFRb","JZOFOb RUFUb","MWRFRb ROWUW ROQUQ","MWRYSZR[QZRYR[ RRSQGRFSGRSRF","GpL[LFQFTGVIWKXOXRWVVXTZQ[L[ R_FmF_[m[ Rb>fAj>","GmL[LFQFTGVIWKXOXRWVVXTZQ[L[ R_MjM_[j[ RaEeHiE",
            "ImW[WF RWZU[Q[OZNYMWMQNOONQMUMWN R_MjM_[j[ RaEeHiE","HiW[M[MF RdFdUcXaZ^[\\[","HcW[M[MF R^M^_]a[bZb R^F]G^H_G^F^H","MbU[SZRXRF R]M]_\\aZbYb R]F\\G]H^G]F]H","GmL[LFX[XF RhFhUgXeZb[`[","GgL[LFX[XF RbMb_aa_b^b RbFaGbHcGbFbH","IfNMN[ RNOONQMTMVNWPW[ RaMa_`a^b]b RaF`GaHbGaFaH","I[MUWU RK[RFY[ RN>RAV>","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNERHVE","MWR[RF RN>RAV>","MWR[RM RNERHVE","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RN>RAV>","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNERHVE","G]LFLWMYNZP[T[VZWYXWXF RN>RAV>",
            "H[VMV[ RMMMXNZP[S[UZVY RNERHVE","G]LFLWMYNZP[T[VZWYXWXF RN?O@NAM@N?NA RV?W@VAU@V?VA RM;W;","H[VMV[ RMMMXNZP[S[UZVY RNFOGNHMGNFNH RVFWGVHUGVFVH RM@W@","G]LFLWMYNZP[T[VZWYXWXF RN?O@NAM@N?NA RV?W@VAU@V?VA RT9Q<","H[VMV[ RMMMXNZP[S[UZVY RNFOGNHMGNFNH RVFWGVHUGVFVH RT>QA","G]LFLWMYNZP[T[VZWYXWXF RN?O@NAM@N?NA RV?W@VAU@V?VA RN9R<V9","H[VMV[ RMMMXNZP[S[UZVY RNFOGNHMGNFNH RVFWGVHUGVFVH RN>RAV>","G]LFLWMYNZP[T[VZWYXWXF RN?O@NAM@N?NA RV?W@VAU@V?VA RP9S<","H[VMV[ RMMMXNZP[S[UZVY RNFOGNHMGNFNH RVFWGVHUGVFVH RP>SA",
            "I[NNPMTMVNWPWXVZT[P[NZMXMVWT","I[MUWU RK[RFY[ RN?O@NAM@N?NA RV?W@VAU@V?VA RM;W;","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNFOGNHMGNFNH RVFWGVHUGVFVH RM@W@","I[MUWU RK[RFY[ RR?Q@RAS@R?RA RM;W;","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RRFQGRHSGRFRH RM@W@","F`JURU RRPYP RH[OF\\F RRFR[\\[ RO@Y@","D`INKMOMQNRP R[ZY[U[SZRXRPSNUMYM[N\\P\\RRSKSITHVHXIZK[O[QZRX RMGWG","F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RSV[V","I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN RS^[^","F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RN>RAV>",
            "I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN RNERHVE","G\\L[LF RX[OO RXFLR RN>RAV>","IZN[NF RPSV[ RVMNU RJANDRA","G]R[P]O_PaRbTb RPFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF","H[R[P]O_PaRbTb RP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[","G]R[P]O_PaRbTb RPFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RM@W@","H[R[P]O_PaRbTb RP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RMGWG","H\\KFXFQNTNVOWPXRXWWYVZT[N[LZKY RN>RAV>","JZMMVMOVRVTWUXVZV^U`TaRbObMa RNERHVE","MWRMR_QaObNb RNERHVE","GpL[LFQFTGVIWKXOXRWVVXTZQ[L[ R_FmF_[m[",
            "GmL[LFQFTGVIWKXOXRWVVXTZQ[L[ R_MjM_[j[","ImW[WF RWZU[Q[OZNYMWMQNOONQMUMWN R_MjM_[j[","F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RT>QA","I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN RTEQH","CaH[HF RHPTP RTFTXUZW[Z[\\Z]X]M","G\\LFLb RLINGPFTFVGWHXJXOWRUUL^","G]L[LFX[XF RP>SA","I\\NMN[ RNOONQMTMVNWPW[ RPESH","I[MUWU RK[RFY[ RZ9X< RR;P<O>P@RAT@U>T<R;","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RZ@XC RRBPCOEPGRHTGUETCRB","F`JURU RRPYP RH[OF\\F RRFR[\\[ RV>SA","D`INKMOMQNRP R[ZY[U[SZRXRPSNUMYM[N\\P\\RRSKSITHVHXIZK[O[QZRX RTEQH",
            "G]ZFJ[ RP[NZLXKTKMLINGPFTFVGXIYMYTXXVZT[P[ RT>QA","H[XMK[ RP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RTEQH","I[MUWU RK[RFY[ ROAL> RVAS>","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR ROHLE RVHSE","I[MUWU RK[RFY[ RNAO?Q>S>U?VA","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNHOFQESEUFVH","H[MPTP RW[M[MFWF ROAL> RVAS>","I[VZT[P[NZMXMPNNPMTMVNWPWRMT ROHLE RVHSE","H[MPTP RW[M[MFWF RNAO?Q>S>U?VA","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNHOFQESEUFVH","MWR[RF ROAL> RVAS>","MWR[RM ROHLE RVHSE","MWR[RF RNAO?Q>S>U?VA","MWR[RM RNHOFQESEUFVH",
            "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF ROAL> RVAS>","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ ROHLE RVHSE","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RNAO?Q>S>U?VA","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNHOFQESEUFVH","G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ ROAL> RVAS>","KXP[PM RPQQORNTMVM RPHME RWHTE","G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ RNAO?Q>S>U?VA","KXP[PM RPQQORNTMVM ROHPFRETEVFWH","G]LFLWMYNZP[T[VZWYXWXF ROAL> RVAS>","H[VMV[ RMMMXNZP[S[UZVY ROHLE RVHSE","G]LFLWMYNZP[T[VZWYXWXF RNAO?Q>S>U?VA",
            "H[VMV[ RMMMXNZP[S[UZVY RNHOFQESEUFVH","H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RS`SaRcQd","J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RS`SaRcQd","JZLFXF RR[RF RS`SaRcQd","MYOMWM RRFRXSZU[W[ RU`UaTcSd","I]VRXTYVY[X]V_T`Lb RLHMGOFUFWGXHYJYNXPVRTSNU","J[UWVXWZW]V_U`SaMb RMNOMSMUNVOWQWTVVUWSXOY","G]L[LF RLPXP RX[XF RN>RAV>","H[M[MF RV[VPUNSMPMNNMO RI>MAQ>","G]L[LFX[XF RX[Xb","IbWFWXXZZ[\\[^Z_X^V\\UZVV^ RWNUMQMONNOMQMWNYOZQ[T[VZWX","G]NFLGKIKKLMMNOO RVFXGYIYKXMWNUO ROOUOWPXQYSYWXYWZU[O[MZLYKWKSLQMPOO",
            "J[MJMMNORQVOWMWJ RPQTQVRWTWXVZT[P[NZMXMTNRPQ","H\\KFYFK[Y[ RY[Y_XaVbTb","IZLMWML[W[ RW[W_VaTbRb","I[MUWU RK[RFY[ RR?Q@RAS@R?RA","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RRFQGRHSGRFRH","H[MPTP RW[M[MFWF RR\\T]U_TaRbOb","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RR\\T]U_TaRbOb","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RN?O@NAM@N?NA RV?W@VAU@V?VA RM;W;","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNFOGNHMGNFNH RVFWGVHUGVFVH RM@W@","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RMAN@P?TAV@W? RM;W;",
            "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RMHNGPFTHVGWF RM@W@","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RR?Q@RAS@R?RA","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RRFQGRHSGRFRH","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RR?Q@RAS@R?RA RM;W;","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RRFQGRHSGRFRH RM@W@","I[RQR[ RKFRQYF RM@W@","JZMMR[ RWMR[P`OaMb RMGWG","M]RFRXSZU[W[YZZXYVWUUVQ^","IbNMN[ RNOONQMTMVNWPWXXZZ[\\[^Z_X^V\\UZVV^","M]OMWM RRFRXSZU[W[YZZXYVWUUVQ^","MWRMR_QaObNb","D`R[RF RRZP[L[JZIYHWHQIOJNLMPMRN RTMXMZN[O\\Q\\W[YZZX[T[RZ",
            "D`RMRb RRZP[L[JZIYHWHQIOJNLMPMRN RTMXMZN[O\\Q\\W[YZZX[T[RZ","I[MUWU RK[RFY[ RXCL`","F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RXCL`","HZVZT[P[NZMYLWLQMONNPMTMVN RWHM`","HYW[M[MF RIOQO","JZLFXF RR[RF RXCL`","J[P[R^T_W_ RNZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN","IZLMWML[N[P\\R^T_W_","J^MGPFTFWGYIZKZNYPWRTSPSP[","J^NNPMTMVNWOXQXSWUVVTWPWP[","G\\SPVQWRXTXWWYVZT[L[LFSFUGVHWJWLVNUOSPLP RIUOU","G]IM[M RLFLWMYNZP[T[VZWYXWXF","I[Y[RFK[","H[MPTP RW[M[MFWF RXCL`","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RWHM`","JZUFUUTXRZO[M[ RQPYP",
            "MWRMR_QaObNb ROTUT RRFQGRHSGRFRH","G]XFX^Y`Za\\b^b RXIVGTFPFNGLIKMKTLXNZP[T[VZXX","I\\WMW^X`Ya[b]b RWZU[Q[OZNYMWMQNOONQMUMWN","G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ RIQOQ","KXP[PM RPQQORNTMVM RMTUT","I[KIYI RRQR[ RKFRQYF","JZLQXQ RMMR[ RWMR[P`OaMb","H[MMMXNZP[T[VZ RMNOMTMVNWPWRVTTUOUMV","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[","G\\K[NQOOPNRMTMVNWOXRXVWYVZT[R[PZOYNWMPLNJM","H[RFPFNGMIM[ RMNOMSMUNVOWQWWVYUZS[O[MZ","J\\NNPMTMVNWOXQXWWYVZT[P[NZ","HZVNTMPMNNMOLQLWMYNZP[S[UZVXUVSUQVM^",
            "I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN RW[W_XaZb\\b","I\\\\FZFXGWIW[ RWZU[Q[OZNYMWMQNOONQMUMWN","I[NZP[T[VZWXWPVNTMPMNNMPMRWT","I[NNPMTMVNWPWXVZT[P[NZMXMVWT","IbNNPMTMVNWPWXVZT[P[NZMXMV\\S\\U]W_X`X","IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN","J[TTVSWQWPVNTMPMNN RRTTTVUWWWXVZT[P[NZ","JaRTTTVUWWWXVZT[P[NZ RNNPMTMVNWPWQVSTT[S[U\\W^X_X","H[TTVSWQWPVNTMPMNNMOLRLVMYNZP[T[VZWXWWVUTTRT","MWRMR_QaObNb ROTUT","I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN RWMWIXGZF\\F","I\\WYVZT[P[NZMXMQNOONQMWMW^V`UaSbMb",
            "HZUNSMPMNNMOLQLWMYNZP[T[VZVUSU","JZMMU[U_TaRbPaO_O[WM","JZMMTVUXTZR[PZOXPVWM","I\\WMWb RNMNXOZQ[T[VZWY","H[RFPFNGMIM[ RV[VPUNSMPMNNMO","H[RFPFNGMIM[ RV[VPUNSMPMNNMO RV[V_UaSbQb","MWR[RM ROTUT RRFQGRHSGRFRH","MXRMRXSZU[","MWR[RM RU[O[ RUMOM","MXU[SZRXRF RMONNPMTOVNWM","IYU[SZRXRF RRQQOONMOLQMSOTWT","MXRFR_SaUbWb","GZLFLXMZO[ RLMVMOVRVTWUXVZV^U`TaRbObMa","D`[M[[ R[YZZX[U[SZRXRM RRXQZO[L[JZIXIM","D`[M[[ R[YZZX[U[SZRXRM RRXQZO[L[JZIXIM R[[[b","D`I[IM RIOJNLMOMQNRPR[ RRPSNUMXMZN[P[[ R[[[_ZaXbVb",
            "I\\NMN[ RNOONQMTMVNWPW[ RN[N_MaKbIb","I\\NMN[ RNOONQMTMVNWPW[ RW[W_XaZb\\b","H[M[MMV[VM","H[LTWT RP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[","E]RTXT RRMR[ RZMMMKNJOIQIWJYKZM[Z[","G]RTRXSZU[V[XZYXYQXOWNUMOMMNLOKQKXLZN[O[QZRX","G]RFRb RPMTMVNXPYRYVXXVZT[P[NZLXKVKRLPNNPM","LYTMT[ RTWSYRZP[N[","LYTMT[ RTWSYRZP[N[ RTMTF","LYTMT[ RTWSYRZP[N[ RT[T_UaWbYb","KXP[PM RPQQORNTMVM RP[Pb","KXP[PM RPQQORNTMVM RP[P_QaSbUb","KXM[S[ RVMTMRNQOPRP[","LYW[Q[ RNMPMRNSOTRT[","I[RUW[ RN[NMTMVNWPWRVTTUNU","I[RSWM RNMN[T[VZWXWVVTTSNS",
            "J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RN[N_OaQbSb","KYWFUFSGRIR_QaObMb","MWRMR_QaObNb ROTUT RRMRISGUFWF","KYMFOFQGRIRXSZU[W[","KYWFUFSGRIR_QaObMaL_M]O\\V\\","KWU[M[ RRbRPQNOMMM","MYOMWM RRFR_SaUbWb","H[JRYR RVMV[ RMMMXNZP[S[UZVY","I\\XMUMUPWRXTXWWYVZT[Q[OZNYMWMTNRPPPMMM","H[MMMXNZP[S[UZVYWWWPVNUM","JZW[RMM[","G]Z[VMRWNMJ[","JZW[RM RM[RMTHUGWF","KYRTR[ RMMRTWM","IZLMWML[W[ RW[W_XaZb\\b","IZLMWML[T[VZWXVVTURVN^","JZMMVMOVRVTWUXVZV^U`TaRbObMa","JZMMVMOVRVTWUXVZV^U`TaRbPbNaM_N]P\\R]Uc","J^MGPFTFWGYIZKZNYPWRTSPSP[",
            "FZWGTFPFMGKIJKJNKPMRPSTST[","J^MZP[T[WZYXZVZSYQWOTNPNPF","F[WHVGSFQFNGLIKKJOJYK]L_NaQbSbVaW`","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RROQPRQSPRORQ","I[STVUWWWXVZT[N[NMSMUNVPVQUSSTNT","I\\PTNUMWMXNZP[T[VZWYXVXRWOVNTMPMNNMPMQNSPTRT","HZUNSMPMNNMOLQLWMYNZP[T[VZVUSU RUMUIVGXFZF","H[MTVT RMMM[ RVMV[","LXRMR_QaObMaL_M]O\\V\\ RRFQGRHSGRFRH","J[VMVb RTUNM RN[VS","JYOMO[V[","I\\WMWb RWZU[Q[OZNYMWMQNOONQMUMWN RWMWIXGZF\\F","J^MGPFTFWGYIZKZNYPWRTSPSP[ RLXTX","FZWGTFPFMGKIJKJNKPMRPSTST[ RPXXX",
            "D`R[RF RRM]MR[][ RRZP[L[JZIYHWHQIOJNLMPMRN","E`RFR[ RRNPMMMKNJOIQIWJYKZM[P[RZ RRM\\MUVXVZW[X\\Z\\^[`ZaXbUbSa","D`R[RF RRM]MR[Z[\\Z]X\\VZUXVT^ RRZP[L[JZIYHWHQIOJNLMPMRN","G^IMQM RLFLXMZO[QZS[W[YZZXZWYUWTTTRSQQQPRNTMWMYN","I[KMTM RNFNXOZQ[T[ RYFWFUGTIT_SaQbOb","F^HMPM RKFKXLZN[P[RZ RZNXMTMRNQOPQPWQYRZT[W[YZZXYVWUUVQ^","F]HMPMP[ RK[KILGNFPF RPOQNSMVMXNYPY_XaVbTb","G^LFLXMZO[QZS[W[YZZXZWYUWTTTRSQQQPRNTMWMYN","H^MM[MP[ RMFMXNZP[[[","G]JSN[RUV[ZS RJFNNRHVNZF","G]XXXSLSLX RXKXFLFLK","I\\WMWb RNMNXOZQ[T[VZWY RNMNIMGKFIF",
            "I\\\\bZbXaW_WM RNMNXOZQ[T[VZWY RNMNIMGKFIF","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","H[MFM[ RXPMP","IZNTVT RNMN[","G]R[RF RKOKFYFYO","I[R[RF RMOMFWFWO","MWSFQJ","MWS[Q_","G]LFL[XFX[","H\\MMM[WMW[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "NVR`RcSdTd","J\\NZP[T[VZWYXWXQWOVNTMPMNN","HZVZT[P[NZMYLWLQMONNPMTMVN RRSQTRUSTRSRU","J\\NZP[T[VZWYXWXQWOVNTMPMNN RRSQTRUSTRSRU","MWSZS[R]Q^ RRNSORPQORNRP","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","NVTEQH","LXNFOGNHMGNFNH RVFWGVHUGVFVH RT>QA","G[MUWU RK[RFY[ RMEJH","JZRRQSRTSSRRRT","B[MPTP RW[M[MFWF RHEEH","A]L[LF RLPXP RX[XF RGEDH","GWR[RF RMEJH","RR","B]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RHEEH","RR","@[RQR[ RKFRQYF RFECH","@^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RFECH",
            "MXRMRXSZU[ RNFOGNHMGNFNH RVFWGVHUGVFVH RT>QA","I[MUWU RK[RFY[","G\\SPVQWRXTXWWYVZT[L[LFSFUGVHWJWLVNUOSPLP","HZM[MFXF","I[K[RFY[K[","H[MPTP RW[M[MFWF","H\\KFYFK[Y[","G]L[LF RLPXP RX[XF","F^OPUP RPFTFVGXIYKZNZSYVXXVZT[P[NZLXKVJSJNKKLINGPF","MWR[RF","G\\L[LF RX[OO RXFLR","I[K[RFY[","F^K[KFRUYFY[","G]L[LFX[XF","H[L[W[ RLFWF RUPNP","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF","G]L[LFXFX[","G\\L[LFTFVGWHXJXMWOVPTQLQ","RR","H[W[L[SPLFWF","JZLFXF RR[RF","I[RQR[ RKFRQYF","G]R[RF RPITIWJYLZNZRYTWVTWPWMVKTJRJNKLMJPI",
            "H\\KFY[ RYFK[","G]R[RF RHFJGKIKNLQMROSUSWRXQYNYIZG\\F","F^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[","MWR[RF RN?O@NAM@N?NA RV?W@VAU@V?VA","I[RQR[ RKFRQYF RN?O@NAM@N?NA RV?W@VAU@V?VA","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RTEQH","IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN RTEQH","I\\NMN[ RNOONQMTMVNWPWb RTEQH","MXRMRXSZU[ RTEQH","H[MMMXNZP[S[UZVYWWWPVNUM RNFOGNHMGNFNH RVFWGVHUGVFVH RT>QA","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[","H[SOUPVQWSWWVYUZS[P[NZMY RKbLaM_MINGPFSFUGVIVLUNSOQO","JZRYRb RLMMMNNRYWM",
            "H[SMPMNNMOLQLWMYNZP[S[UZVYWWWQVOUNSMPLNKMINGPFTFVG","IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN","HZMFWFPMNPMSMWNYOZQ[S[U\\V^V_UaSbRb","I\\NMN[ RNOONQMTMVNWPWb","H[LPWP RPFSFUGVHWKWVVYUZS[P[NZMYLVLKMHNGPF","MXRMRXSZU[","IZNMN[ RPSV[ RVMNU","JZRMM[ RMFOFPGRMW[","H^MMMb RWXXZZ[ RMXNZP[T[VZWXWM","J[MMR[WPWOVM","HZMFWF RQFOGNINLONQOUO RQOOPNQMSMWNYOZQ[S[U\\V^V_UaSbRb","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[","F]VMV[ ROMOXNZL[ RZMMMKNJP","H\\MbMQNOONQMTMVNWOXQXWWYVZT[Q[OZMX","HZVNTMPMNNMOLQLWMYNZP[S[U\\V^V_UaSb",
            "H\\YMPMNNMOLQLWMYNZP[S[UZVYWWWQVOUNSM","H\\LPMNOMXM RRMRXSZU[","H[MMMXNZP[S[UZVYWWWPVNUM","G]MMLNKPKVLXNZP[T[VZXXYVYPXNVMUMSNRPRb","IZWMLb RLMNNOPT_UaWb","G]RMRb RKMKVLXNZP[T[VZXXYVYM","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM","LXNFOGNHMGNFNH RVFWGVHUGVFVH RRMRXSZU[","H[MMMXNZP[S[UZVYWWWPVNUM RNFOGNHMGNFNH RVFWGVHUGVFVH","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RTEQH","H[MMMXNZP[S[UZVYWWWPVNUM RTEQH","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RTEQH","G\\L[LF RXFLR ROOX[Qb",
            "H[SOUPVQWSWWVYUZS[P[NZMXMINGPFSFUGVIVLUNSOQO","H[JPKQLSLVMYNZP[S[UZVYWVWKVHUGSFPFNGMHLJLLMNNOPPWP","I\\KFMFOGQIRKR[ RRKSHTGVFWFYGZI","NiTEQH RXFZF\\G^I_K_[ R_K`HaGcFdFfGgI","I\\KFMFOGQIRKR[ RRKSHTGVFWFYGZI RN?O@NAM@N?NA RV?W@VAU@V?VA","G]RFRb RPMTMVNXPYRYVXXVZT[P[NZLXKVKRLPNNPM","F^RTRX R[MIM RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM","IZLMNNOPOXNZM[LZLXMVVRWPWNVMUNTPTXUZW[V^U`TaRb","G]R[Rb RPFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF","H[R[Rb RP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[","FZWFQFNGLIKKJOJRKVLXNZQ[R[T\\U^U_TaSbQb",
            "HZVMPMNNMOLQLWMYNZP[R[T\\U^U_TaRbPb","HZTPMP RM[MFWF","MZVPRP RWFUFSGRIR_QaOb","H\\MFOGPILSXNTXUZW[","I[RFMPWPR[","H\\NGNL RXIULTNTW RKIMGPFTFVGXIYKZOZUYYX[","H\\L[UR RR[WV RLMPNSPURWVXZXb","CaRWRR R\\XY]V`SaMa RLFJGHIGLGUHXJZL[N[PZQYRWSYTZV[X[ZZ\\X]U]L\\IZGXF","G]RTRX RXZW\\S`PaOa RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM","G]XFXb RPFNGLIKMKTLXNZP[T[VZXX","I\\WMWb RQMONNOMQMWNYOZQ[T[VZWY","F]KFK[ RKQMOPNTNVOXQYTYWXZW\\U^R`Nb","I[WLWMVPTRRSPSNRMPMONMPLRLTMVPWSWWVYUZS[M[","F]KHLGOFTFWGXHYJYLXOVQJ[N^Q_V_Y^",
            "J[NNPMTMVNWPWRVTTVN[P]R^U^W]","G]I[[[ RIFJFLGXZZ[ R[FZFXGLZJ[","H[KMMNVZX[K[MZVNXM","G\\XEVFOFMGLHKJKWLYMZO[T[VZWYXWXPWNVMTLNLLMKN","H[WEVFTGPGNHMILKLWMYNZP[S[UZVYWWWQVOUNSMOMMNLO","G]RFRb RKQKMYMYQ","I[MMWM RRFRb","IZLMNNOPOXNZM[LZLXMVVRWPWNVMUNTPTXUZW[","H\\WbQbOaN`M^MQNOONQMTMVNWOXQXWWYVZT[Q[OZMX","HZVZT[P[NZMYLWLQMONNPMTMVN","MWRMR_QaObNb RRFQGRHSGRFRH","G]KPYP RPFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF","HZLTST RVZT[P[NZMYLWLQMONNPMTMVN","J\\XTQT RNZP[T[VZWYXWXQWOVNTMPMNN","G\\LFL[ RLKTKVLWMXOXRWTVUTVLV",
            "H[MFMb RMNOMSMUNVOWQWWVYUZS[O[MZ","F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH","F^K[KFRMYFY[","G]LbLMRSXMX[","G\\J`S` RMbMQNOONQMTMVNWOXQXWWYVZT[Q[OZMX","I^MYNZQ[S[VZXXYVZRZOYKXIVGSFQFNGMH","F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RROQPRQSPRORQ","I^MYNZQ[S[VZXXYVZRZOYKXIVGSFQFNGMH RROQPRQSPRORQ","H[MPTP RW[M[MFWF RP>SA","H[MPTP RW[M[MFWF RN?O@NAM@N?NA RV?W@VAU@V?VA","JbLFXF RR[RF RRMXM[N]P^S^\\]_[aXbVb","HZM[MFXF RT>QA","F[JPTP RWYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH","H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG","MWR[RF",
            "MWR[RF RN?O@NAM@N?NA RV?W@VAU@V?VA","JZUFUUTXRZO[M[","AbC[D[FZGXILJILGOFRFR[X[[Z]X^V^S]Q[OXNRN","AbF[FF RRFR[X[[Z]X^V^S]Q[OXNFN","JbLFXF RR[RF RRMXM[N]P^S^[","G\\L[LF RX[OO RXFLR RT>QA","G]LFL[XFX[ RP>SA","G[KFRT RYFPXNZL[K[ RN>O@QASAU@V>","G]R[R` RLFL[X[XF","I[MUWU RK[RFY[","G\\VFLFL[R[UZWXXVXSWQUORNLN","G\\SPVQWRXTXWWYVZT[L[LFSFUGVHWJWLVNUOSPLP","HZM[MFXF","F^[`[[I[I` RW[WFRFPGOHNJL[","H[MPTP RW[M[MFWF","BbOOF[ RR[RF RRRFF R^[UO R^FRR","I]PPTP RMGOFTFVGWHXJXLWNVOTPWQXRYTYWXYWZU[O[MZ","G]LFL[XFX[",
            "G]LFL[XFX[ RN>O@QASAU@V>","G\\L[LF RX[OO RXFLR","F\\W[WFTFQGOINLLXKZI[H[","F^K[KFRUYFY[","G]L[LF RLPXP RX[XF","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF","G]L[LFXFX[","G\\L[LFTFVGWHXJXMWOVPTQLQ","F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH","JZLFXF RR[RF","G[KFRT RYFPXNZL[K[","G]R[RF RPITIWJYLZNZRYTWVTWPWMVKTJRJNKLMJPI","H\\KFY[ RYFK[","G]XFX[ RLFL[Z[Z`","H\\WFW[ RLFLNMPNQPRWR","CaRFR[ RHFH[\\[\\F","CaRFR[ RHFH[\\[\\F R\\[^[^`","F]HFMFM[S[VZXXYVYSXQVOSNMN","Da\\F\\[ RIFI[O[RZTXUVUSTQROONIN","H]MFM[S[VZXXYVYSXQVOSNMN",
            "I^ZQPQ RMHNGQFSFVGXIYKZOZRYVXXVZS[Q[NZMY","CaHFH[ ROPHP RTFXFZG\\I]M]T\\XZZX[T[RZPXOTOMPIRGTF","G\\RQK[ RW[WFOFMGLHKJKMLOMPOQWQ","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR","H[WEVFTGPGNHMILKLWMYNZP[S[UZVYWWWQVOUNSMOMMNLO","I[STVUWWWXVZT[N[NMSMUNVPVQUSSTNT","JYO[OMWM","H[WOVNTMPMNNMOLQLWMYNZP[S[UZVYWWWJVHUGSFOFMG","I[VZT[P[NZMXMPNNPMTMVNWPWRMT","F^QTJ[ RRUJM RRMR[ RZ[ST RZMRU","K[RTTT RNNPMTMVNWPWQVSTTVUWWWXVZT[P[NZ","H\\MMM[WMW[","H\\MMM[WMW[ RNEOGQHSHUGVE","IZNMN[ RPSV[ RVMNU","I[V[VMSMQNPPOXNZL[","G]L[LMRXXMX[",
            "H[MTVT RMMM[ RVMV[","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[","H[M[MMVMV[","H[MMMb RMNOMSMUNVOWQWWVYUZS[O[MZ","HZVZT[P[NZMYLWLQMONNPMTMVN","KYMMWM RRMR[","JZMMR[ RWMR[P`OaMb","G]RFRb RPMTMVNXPYRYVXXVZT[P[NZLXKVKRLPNNPM","IZL[WM RLMW[","I\\WMW[ RNMN[Y[Y`","J\\VMV[ RNMNROTQUVU","F^RMR[ RKMK[Y[YM","F^RMR[ RKMK[Y[YM RY[[[[`","HZJMNMN[S[UZVXVUUSSRNR","F^YMY[ RKMK[P[RZSXSURSPRKR","IZNMN[S[UZVXVUUSSRNR","J\\XTQT RNNPMTMVNWOXQXWWYVZT[P[NZ","E_JTPT RJMJ[ RT[RZQYPWPQQORNTMWMYNZO[Q[WZYYZW[T[","I[RUM[ RV[VMPMNNMPMRNTPUVU",
            "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RPESH","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNFOGNHMGNFNH RVFWGVHUGVFVH","M^OKXK RRFR[ RRSSRUQWQYRZTZ[Y^WaVb","JYO[OMWM RTEQH","HZLTST RVZT[P[NZMYLWLQMONNPMTMVN","J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN","MWR[RM RRFQGRHSGRFRH","LXNFOGNHMGNFNH RVFWGVHUGVFVH RR[RM","MWRMR_QaObNb RRFQGRHSGRFRH","E^H[JZKXLPMNOMRMR[W[YZZXZUYSWRRR","D^IMI[ RRMR[W[YZZXZVYTWSIS","M^OKXK RRFR[ RRSSRUQWQYRZTZ[","IZNMN[ RPSV[ RVMNU RTEQH","H\\MMM[WMW[ RPESH","JZMMR[ RWMR[P`OaMb RNEOGQHSHUGVE","H]R[R` RMMM[W[WM",
            "CaRWRR RLFJGHIGLGUHXJZL[N[PZQYRWSYTZV[X[ZZ\\X]U]L\\IZGXF","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM","F]IIVI RMFM[S[VZXXYVYSXQVOSNMN","HZJMTM RNFN[S[UZVXVUUSSRNR","D`IFI[ RYPIP R\\Y[ZX[V[SZQXPVOROOPKQISGVFXF[G\\H","F^KMK[ RWTKT RZZX[T[RZQYPWPQQORNTMXMZN","F^LSXS RRSR[ RH[RF\\[","I[NUVU RRUR[ RK[RMY[","AbF[FF RFS\\S RVSV[ RL[VF`[","E_J[JM RVUV[ RZUJU RO[VM][","E_R[RPJFZFRP RI[IVJSLQOPUPXQZS[V[[","G]R[RTLMXMRT RK[KXLVMUOTUTWUXVYXY[","AcF[FF RFPSP RV[VPNF^FVP RM[MVNSPQSPYP\\Q^S_V_[",
            "DaI[IM RITST RV[VTPM\\MVT RO[OXPVQUSTYT[U\\V]X][","H\\OPSP RNAQFSBTAUA RLGNFSFUGVHWJWLVNUOSPVQWRXTXWWYVZT[O[M\\L^L_MaObWb","J[RTTT ROHRMTIUHVH RNNPMTMVNWPWQVSTTVUWWWXVZT[Q[O\\N^N_OaQbVb","G]R[RF RHFJGKIKNLQMROSUSWRXQYNYIZG\\F","G]RMRb RKMKVLXNZP[T[VZXXYVYM","G]KPYP RPFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF","H[LTWT RP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[","I[KFR[YF","JZMMR[WM","I[KFR[YF ROAL> RVAS>","JZMMR[WM ROHLE RVHSE","GmPFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF R`Me[ RjMe[c`ba`b",
            "HkP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ R^Mc[ RhMc[a``a^b","CaRXR^ RRCRI RMFJGHIGLGUHXJZM[W[ZZ\\X]U]L\\IZGWFMF","G]RYR] RRKRO ROMMNLOKQKWLYMZO[U[WZXYYWYQXOWNUMOM","CaRWRR RLFJGHIGLGUHXJZL[N[PZQYRWSYTZV[X[ZZ\\X]U]L\\IZGXF RLBM@O?R?U@X@","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RLIMGOFRFUGXG","CaRWRR RLFJGHIGLGUHXJZL[N[PZQYRWSYTZV[X[ZZ\\X]U]L\\IZGXF RM<W< RR<R?","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RMEWE RRERH","FZWGTFPFMGKIJKJNKPMRPSTST[","FZVNTMPMNNMOLQLSMUNVPWTWT[","H[N]UO ROQWU RT[LW","JZMHMFWGWE",
            "JZMHUEVH","NVPESH","NVTEQH","KZLIMGOFRFUGXG",":j>R?PAOCPDR RC^D\\F[H\\I^ RCFDDFCHDIF ROcPaR`TaUc ROAP?R>T?UA R[^\\\\^[`\\a^ R[F\\D^C`DaF R`RaPcOePfR",":jDQ>Q RH[D_ RHGDC RR_Re RRCR= R\\[`_ R\\G`C R`QfQ","G]LFL[XFX[ RX[[[Ub RN>O@QASAU@V>","H\\MMM[WMW[ RW[Z[Tb RNEOGQHSHUGVE","H]MFM[S[VZXXYVYSXQVOSNMN RJIPI","IZKMQM RNFN[S[UZVXVUUSSRNR","G\\L[LFTFVGWHXJXMWOVPTQLQ RTMXS","H[MMMb RMNOMSMUNVOWQWWVYUZS[O[MZ RSWW]","HZM[MFXFXA","JYO[OMWMWH","HZM[MFXF RJQRQ","JYO[OMWM RLTTT","H]M[MFXF RMMSMVNXPYSY\\X_VaSbQb",
            "J\\O[OMWM ROTTTVUWVXXX[W^UaTb","BbOOF[ RR[RF RRRFF R^[UO R^FRR R^[`[``","F^QTJ[ RRUJM RRMR[ RZ[ST RZMRU RZ[\\[\\`","I]PPTP RMGOFTFVGWHXJXLWNVOTPWQXRYTYWXYWZU[O[MZ RR\\T]U_TaRbOb","K[RTTT RNNPMTMVNWPWQVSTTVUWWWXVZT[P[NZ RR\\T]U_TaRbOb","G\\L[LF RX[OO RXFLR RX[Z[Z`","IZNMN[ RPSV[ RVMNU RV[X[X`","G\\L[LF RX[OO RXFLR RPKPS","IZNMN[ RPSV[ RVMNU RRORW","G\\L[LF RX[OO RXFLR RIJOJ","IZN[NF RPSV[ RVMNU RKJQJ","E\\X[OO RXFLR RGFLFL[","HZPSV[ RVMNU RJMNMN[","G]L[LF RLPXP RX[XF RX[Z[Z`","H[MTVT RMMM[ RVMV[ RV[X[X`",
            "GeL[LF RLPXP RX[XFcF","H`MTVT RMMM[ RV[VM^M","GhL[LFXFX[ RXM^MaNcPdSd\\c_aa^b\\b","HcM[MMVMV[ RVT[T]U^V_X_[^^\\a[b","F^QFNGLIKKJOJRKVLXNZQ[S[VZXXYVZRZMYJWIVITJSMSRTVUXWZY[[[","H\\QMPMNNMOLQLWMYNZP[T[VZWYXWXRWPUOSPRRRWSYTZV[Y[","F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RR\\T]U_TaRbOb","HZVZT[P[NZMYLWLQMONNPMTMVN RR\\T]U_TaRbOb","JZLFXF RR[RF RR[T[T`","KYMMWM RRMR[ RR[T[T`","I[RQR[ RKFRQYF","JZR[Rb RMMR[WM","I[RQR[ RKFRQYF RNUVU","JZR[Rb RMMR[WM RN]V]","H\\KFY[ RYFK[ RX[Z[Z`","IZL[WM RLMW[ RV[X[X`",
            "D]FFRF RXFX[ RLFL[Z[Z`","G\\RMIM RWMW[ RNMN[Y[Y`","H\\WFW[ RLFLNMPNQPRWR RW[Y[Y`","J\\VMV[ RNMNROTQUVU RV[X[X`","H\\WFW[ RLFLNMPNQPRWR RRNRV","J\\VMV[ RNMNROTQUVU RRQRY","G]L[LF RL[ RLPRPUQWSXVX[","H[M[MF RV[VPUNSMPMNNMO","@^WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGXIYKZOJQGQEPDOCMCK","E[VZT[P[NZMXMPNNPMTMVNWPWRMTKTISHQHO","@^WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGXIYKZOJQGQEPDOCMCK RR[P]O_PaRbTb","E[VZT[P[NZMXMPNNPMTMVNWPWRMTKTISHQHO RR[P]O_PaRbTb","MWR[RF","BbOOF[ RR[RF RRRFF R^[UO R^FRR RN>O@QASAU@V>",
            "F^QTJ[ RRUJM RRMR[ RZ[ST RZMRU RNEOGQHSHUGVE","G\\L[LF RX[OO RXFLR RX[X_WaUbSb","IZNMN[ RPSV[ RVMNU RV[V_UaSbQb","F\\W[WFTFQGOINLLXKZI[H[ RW[Z[Tb","I[V[VMSMQNPPOXNZL[ RV[Y[Sb","G]L[LF RLPXP RX[XF RX[X_WaUbSb","H[MTVT RMMM[ RVMV[ RV[V_UaSbQb","G]L[LF RLPXP RX[XF RX[[[Ub","H[MTVT RMMM[ RVMV[ RV[Y[Sb","H\\WFW[ RLFLNMPNQPRWR RW[U[U`","J\\VMV[ RNMNROTQUVU RV[T[T`","F^K[KFRUYFY[ RY[\\[Vb","G]L[LMRXXMX[ RX[[[Ub","MWR[RF","I[MUWU RK[RFY[ RN>O@QASAU@V>","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNEOGQHSHUGVE",
            "I[MUWU RK[RFY[ RN?O@NAM@N?NA RV?W@VAU@V?VA","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNFOGNHMGNFNH RVFWGVHUGVFVH","F`JURU RRPYP RH[OF\\F RRFR[\\[","D`INKMOMQNRP R[ZY[U[SZRXRPSNUMYM[N\\P\\RRSKSITHVHXIZK[O[QZRX","H[MPTP RW[M[MFWF RN>O@QASAU@V>","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNEOGQHSHUGVE","F^MHNGQFSFVGXIYKZOZRYVXXVZS[Q[NZLXKVJRZP","I[NNPMTMVNWPWXVZT[P[NZMXMVWT","F^MHNGQFSFVGXIYKZOZRYVXXVZS[Q[NZLXKVJRZP RNBOCNDMCNBND RVBWCVDUCVBVD","I[NNPMTMVNWPWXVZT[P[NZMXMVWT RNFOGNHMGNFNH RVFWGVHUGVFVH",
            "BbOOF[ RR[RF RRRFF R^[UO R^FRR RN?O@NAM@N?NA RV?W@VAU@V?VA","F^QTJ[ RRUJM RRMR[ RZ[ST RZMRU RNFOGNHMGNFNH RVFWGVHUGVFVH","I]PPTP RMGOFTFVGWHXJXLWNVOTPWQXRYTYWXYWZU[O[MZ RN?O@NAM@N?NA RV?W@VAU@V?VA","K[RTTT RNNPMTMVNWPWQVSTTVUWWWXVZT[P[NZ RNFOGNHMGNFNH RVFWGVHUGVFVH","H\\KFXFQNTNVOWPXRXWWYVZT[N[LZKY","JZMMVMOVRVTWUXVZV^U`TaRbObMa","G]LFL[XFX[ RM@W@","H\\MMM[WMW[ RMGWG","G]LFL[XFX[ RN?O@NAM@N?NA RV?W@VAU@V?VA","H\\MMM[WMW[ RNFOGNHMGNFNH RVFWGVHUGVFVH","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RN?O@NAM@N?NA RV?W@VAU@V?VA",
            "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNFOGNHMGNFNH RVFWGVHUGVFVH","G]KPYP RPFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF","H[LTWT RP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[","G]KPYP RPFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RN?O@NAM@N?NA RV?W@VAU@V?VA","H[LTWT RP[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNFOGNHMGNFNH RVFWGVHUGVFVH","I^ZPPP RMYNZQ[S[VZXXYVZRZOYKXIVGSFQFNGMH RN?O@NAM@N?NA RV?W@VAU@V?VA","J\\XTQT RNZP[T[VZWYXWXQWOVNTMPMNN RNFOGNHMGNFNH RVFWGVHUGVFVH","G[KFRT RYFPXNZL[K[ RM@W@","JZMMR[ RWMR[P`OaMb RMGWG",
            "G[KFRT RYFPXNZL[K[ RN?O@NAM@N?NA RV?W@VAU@V?VA","JZMMR[ RWMR[P`OaMb RNFOGNHMGNFNH RVFWGVHUGVFVH","G[KFRT RYFPXNZL[K[ RQ>NA RX>UA","JZMMR[ RWMR[P`OaMb RQENH RXEUH","H\\WFW[ RLFLNMPNQPRWR RN?O@NAM@N?NA RV?W@VAU@V?VA","J\\VMV[ RNMNROTQUVU RNFOGNHMGNFNH RVFWGVHUGVFVH","HZM[MFXF RM[O[O`","JYO[OMWM RO[Q[Q`","Da\\F\\[ RIFI[O[RZTXUVUSTQROONIN RN?O@NAM@N?NA RV?W@VAU@V?VA","F^YMY[ RKMK[P[RZSXSURSPRKR RNFOGNHMGNFNH RVFWGVHUGVFVH","HZWFMFM[Q[Q_PaNbLb RJQRQ","JYWMOMO[S[S_RaPbNb RLTTT",
            "H\\KFY[ RYFK[ RX[X_WaUbSb","IZL[WM RLMW[ RV[V_UaSbQb","H\\KFY[ RYFK[ RNPVP","IZL[WM RLMW[ RNTVT","G\\WFW[Q[NZLXKVKSLQNOQNWN","J[VMV[Q[OZNXNUOSQRVR","B_RXSZU[X[ZZ[X[M RRFRXQZO[L[IZGXFVFSGQIOLNRN","E]RXSZU[V[XZYXYQ RRMRXQZO[M[KZJXJUKSMRRR","IePPTP RMGOFTFVGWHXJXLWNVOTPVQWRXTXXYZ[[^[`ZaXaM","KbRTTT RNNPMTMVNWPWQVSTTVUWWWXXZZ[[[]Z^X^Q","I\\PPTP RMGOFTFVGWHXJXLWNVOTPVQWRXTX[Z[Z`","K[RTTT RNNPMTMVNWPWQVSTTVUWWW[Y[Y`","FdH[I[KZLXNLOIQGTFWFWXXZZ[][_Z`X`M","IaL[NZOXPPQNSMVMVXWZY[Z[\\Z]X]Q","CaH[HF RHPTP RTFTXUZW[Z[\\Z]X]M",
            "F^KTTT RKMK[ RTMTXUZW[X[ZZ[X[R","F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR","HZUNSMPMNNMOLQLWMYNZP[T[VZVUSU","J_LFXF RRFRXSZU[X[ZZ[X[M","K]MMWM RRMRXSZU[V[XZYXYS","G[PPTP RWGUFPFNGMHLJLLMNNOPPMQLRKTKWLYMZO[U[WZ","IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN","F\\W[WFTFQGOINLLXKZI[H[ RW[W_VaTbRb","I[V[VMSMQNPPOXNZL[ RV[V_UaSbQb","BaP[^F RD[E[GZHXJLKIMGPF^[","E^[MO[ RH[JZKXLPMNOM[[","E_\\FUO\\[ RJ[JFRFTGUHVJVMUOTPRQJQ","F^KMKb R[MUT[[ RKNMMQMSNTOUQUWTYSZQ[M[KZ","DaOQH[ RTFT[^[ R[QLQJPIOHMHJIHJGLF^F",
            "D`H[MU RRPRMKMINHPHRITKURU R[ZY[U[SZRXRPSNUMYM[N\\P\\RRT","G]Z]X\\VZSWQVOV RP[NZLXKTKMLINGPFTFVGXIYMYTXXVZT[P[","I\\WMWb RWZU[Q[OZNYMWMQNOONQMUMWN","F^IFN[RLV[[F","G]JMN[RQV[ZM","G\\L[LF RX[OO RXFLR RXKRG","IZNMN[ RPSV[ RVMNU RWQQM","FgW[WFTFQGOINLLXKZI[H[ RWM]M`NbPcSc\\b_`a]b[b","IcV[VMSMQNPPOXNZL[ RVT[T]U^V_X_[^^\\a[b","GhL[LF RLPXP RX[XF RXM^MaNcPdSd\\c_aa^b\\b","HcMTVT RMMM[ RVMV[ RVT[T]U^V_X_[^^\\a[b","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","JZNXVX RM[RMW[","H\\LXRX RRTWT RRMR[Y[ RYMPMK[","D`[ZY[U[SZRX RINKMOMQNRPRXQZO[K[IZHXHVRUYU[T\\R\\P[NYMUMSNRP","I[STVUWWWXVZT[N[NMSMUNVPVQUSSTNT RKWQW","HZVZT[P[NZMYLWLQMONNPMTMVN","J[SMOMO[S[UZVYWVWRVOUNSM","J[SMOMO[S[UZVYWVWRVOUNSM RLTRT","JYOTTT RVMOMO[V[",
            "J[TTVSWQWPVNTMPMNN RRTTTVUWWWXVZT[P[NZ","MWRMR[ RRbSaR`QaRbR`","LYTMTWSYRZP[O[","IZNMN[ RPSV[ RVMNU","JYOMO[V[ RLVRR","G]L[LMRXXMX[","I\\W[WMN[NM","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[","J\\NNPMTMVNWOXQXWWYVZT[P[NZ","G]YSYVXXWYUZOZMYLXKVKSLQMPOOUOWPXQYS","G]XYYWYSXQWPUOOOMPLQKSKWLY","G]YNK[ RYSYVXXWYUZOZMYLXKVKSLQMPOOUOWPXQYS","DaINKMOMQNRPRXQZO[K[IZHXHVRT RRWSYTZV[Y[[Z\\Y]W]Q\\O[NYMVMTNSORQ","G]OMNNMPNRPS RTSVRWPVNUM RPSTSVTWVWXVZT[P[NZMXMVNTPS","I\\XTXQWOVNTMQMONNOMQMT","H[LTLWMYNZP[S[UZVYWWWT",
            "I[N[NMTMVNWPWRVTTUNU","I[RUM[ RV[VMPMNNMPMRNTPUVU","I[RSMM RVMV[P[NZMXMVNTPSVS","KYMMWM RRMR[","H[MMMXNZP[S[UZVXVM","G]KPYP RKYVYXXYVYSXQWP","@]KPYP RKYVYXXYVYSXQWP REWFXEYDXEWEY REOFPEQDPEOEQ","G]KKYK RWKXLYNYQXSVTKT RVTXUYWYZX\\V]K]","JZMMR[WM","G]JMN[RQV[ZM","IZLMWML[W[","JZNMVMRRSRUSVUVXUZS[P[NZ","H\\XNUMPMNNMOLQLSMUNVPWTXVYWZX\\X^W`VaTbObLa RRTR\\","JZW[PROPPNRMTNUPTRM[","JYO[OMWM","JZM[RMW[","H[M[MMVMV[","I[N[NMTMVNWPWRVTTUNU","I[RMR[ RLMMNMRNTPUTUVTWRWNXM","I[V[VMSMQNPPOXNZL[","JZNKVK RMNR@WN",
            "H\\LKRK RRGWG RR@RNYN RY@P@KN","I[SGVHWJWKVMTNNNN@S@UAVCVDUFSGNG","I[SGVHWJWKVMTNNNN@S@UAVCVDUFSGNG RKGQG","J[S@O@ONSNUMVLWIWEVBUAS@","JYOGTG RV@O@ONVN","KZUGPG RN@U@UNNN","HZUAS@P@NAMBLDLJMLNMPNTNVMVHSH","H[MGVG RM@MN RV@VN","MWRNR@ RUNON RU@O@","LYT@TJSLRMPNON","IZN@NN RPFVN RV@NH","JYO@ONVN","G]LNL@RKX@XN","H[MNM@VNV@","I\\WNW@NNN@","H[PNNMMLLJLDMBNAP@S@UAVBWDWJVLUMSNPN","G]O@NAMCNEPF RTFVEWCVAU@ RPFTFVGWIWKVMTNPNNMMKMINGPF","I[NNN@T@VAWCWEVGTHNH","I[RHWN RNNN@T@VAWCWEVGTHNH","KYM@W@ RR@RN","H[M@MKNMPNSNUMVKV@",
            "G]J@NNRDVNZ@","KZOEQDSDUEVGVN RVMTNQNOMNKOIQHVH","JYNDNKOMQNSNUM RNEPDSDUEVGUISJNJ","H]WDUKTMRNPNNMMKMGNEPDRDTEVMWN","H\\XMVNUNSMRK RLDODQERHRKQMONNNLMKKKJVJXIYGXEVDUDSERH","KYO@ON ROMQNSNUMVKVGUESDQDOE","KYU@UN RUESDQDOENGNKOMQNSNUM","LYVMTNRNPMOKOGPERDSDUEVGVHOI","LYOEQDSDUEVGVKUMSNRNPMOKOJVI","LXPIRI RUETDPDOEOHPIOJOMPNTNUM","LXRITI ROEPDTDUEUHTIUJUMTNPNOM","KYUDUPTRRSOS RUESDQDOENGNKOMQNSNUM","NVRDRN RRUSTRSQTRURS","IZO@ON RUNQH RUDOJ","G]KNKD RKEMDODQERGRN RRGSEUDVDXEYGYN","KZODON ROEQDSDUEVGVPURSSRS",
            "KYQNOMNKNGOEQDSDUEVGVKUMSNQN","LYOEQDSDUEVGVKUMSNQNOM","KYNINGOEQDSDUEVGVI","KYNINKOMQNSNUMVKVI","KYOSOD ROEQDSDUEVGVKUMSNQNOM","NXPDVD RR@RKSMUNVN","KYUDUN RNDNKOMQNSNUM","I[MFWF RMMTMVLWJWHVF","G]YDYN RYMWNUNSMRKRD RRKQMONNNLMKKKD","LXNDRNVD","LXVNPGPEQDSDTETGNN","KYSFRF RNSOQOCPAR@S@UAVCUESFUGVIVKUMSNQNOM","KXRMRS RMDOERMVD","KYSDQDOENGNKOMQNSNUMVKVGUESDPCOBOAP@U@","I[MDLFLJMLNMPNTNVMWLXJXGWEUDSERGRS","LXVDNS RNDPETRVS","NVRWRa RRPQQRRSQRPRR","LWPWPa RPZQXSWUW","KYUWUa RNWN^O`QaSaU`","LXNWRaVW",
            "KYSYRY RNfOdOVPTRSSSUTVVUXSYUZV\\V^U`SaQaO`","KXR`Rf RMWOXR`VW","KYOfOZPXRWSWUXVZV^U`SaQaO`","I[MWLYL]M_N`PaTaV`W_X]XZWXUWSXRZRf","LXVWNf RNWPXTeVf","D`IMIXJZL[O[QZRX R[ZY[U[SZRXRPSNUMYM[N\\P\\RRT","H[M[MF RMNOMSMUNVOWQWWVYUZS[O[MZ RIHJGLFPHRGSF","I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN RQHRGTFXHZG[F","MYOMWM RR[RISGUFWF RMTNSPRTTVSWR","D`I[IM RIOJNLMOMQNRPR[ RRPSNUMXMZN[P[[ RMTNSPRTTVSWR","I\\NMN[ RNOONQMTMVNWPW[ RMTNSPRTTVSWR","H[MMMb RMNOMSMUNVOWQWWVYUZS[O[MZ RI`J_L^P`R_S^","KXP[PM RPQQORNTMVM RLTMSORSTUSVR",
            "KXM[S[ RVMTMRNQOPRP[ RLTMSORSTUSVR","J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RNTOSQRUTWSXR","MYOMWM RRFRXSZU[W[ RMSNRPQTSVRWQ","IZLMWML[W[ RMTNSPRTTVSWR","H[M[MJNHOGQFTFVG RMNOMSMUNVOWQWWVYUZS[O[MZ","H[MGVG RM@MN RV@VN","JZMMVMOURUTVUWVYV^U`TaRbPbNaM_M^N\\P[V[","MlOMWM RRFRXSZU[W[ R^[^F Rg[gPfNdMaM_N^O RiC]`","MWR[RM RU[O[ RUMOM ROTUT","MXRMRXSZU[ ROTUT","H[MMMb RMNOMSMUNVOWQWWVYUZS[O[MZ RHT\\T","H[MMMXNZP[S[UZVXVM RHT\\T","I\\XMUMUPWRXTXWWYVZT[Q[OZNYMWMTNRPPPMMM RHU\\U","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","I[MUWU RK[RFY[ RR`TaUcTeRfPeOcPaR`","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RR`TaUcTeRfPeOcPaR`","G\\SPVQWRXTXWWYVZT[L[LFSFUGVHWJWLVNUOSPLP RR?Q@RAS@R?RA","H[M[MF RMNOMSMUNVOWQWWVYUZS[O[MZ RN?M@NAO@N?NA",
            "G\\SPVQWRXTXWWYVZT[L[LFSFUGVHWJWLVNUOSPLP RRbSaR`QaRbR`","H[M[MF RMNOMSMUNVOWQWWVYUZS[O[MZ RRbSaR`QaRbR`","G\\SPVQWRXTXWWYVZT[L[LFSFUGVHWJWLVNUOSPLP RWaMa","H[M[MF RMNOMSMUNVOWQWWVYUZS[O[MZ RWaMa","F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RR\\T]U_TaRbOb RT>QA","HZVZT[P[NZMYLWLQMONNPMTMVN RR\\T]U_TaRbOb RTEQH","G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[ RR?Q@RAS@R?RA","I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN RV?U@VAW@V?VA","G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[ RRbSaR`QaRbR`","I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN RSbTaS`RaSbS`",
            "G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[ RWaMa","I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN RXaNa","G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[ RQ\\S]T_SaQbNb","I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN RS\\U]V_UaSbPb","G\\L[LFQFTGVIWKXOXRWVVXTZQ[L[ RVcR`Nc","I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN RWcS`Oc","H[MPTP RW[M[MFWF RM@W@ RP9S<","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RMGWG RP>SA","H[MPTP RW[M[MFWF RM@W@ RT9Q<","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RMGWG RT>QA","H[MPTP RW[M[MFWF RVcR`Nc","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RVcR`Nc","H[MPTP RW[M[MFWF RW`VaTbP`NaMb",
            "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RW`VaTbP`NaMb","H[MPTP RW[M[MFWF RR\\T]U_TaRbOb RN>O@QASAU@V>","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RR\\T]U_TaRbOb RNEOGQHSHUGVE","HZTPMP RM[MFWF RR?Q@RAS@R?RA","MYOMWM RR[RISGUFWF RT?S@TAU@T?TA","F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RM@W@","I\\WMW^V`UaSbPbNa RWZU[Q[OZNYMWMQNOONQMUMWN RMGWG","G]L[LF RLPXP RX[XF RR?Q@RAS@R?RA","H[M[MF RV[VPUNSMPMNNMO RM?L@MAN@M?MA","G]L[LF RLPXP RX[XF RRbSaR`QaRbR`","H[M[MF RV[VPUNSMPMNNMO RRbSaR`QaRbR`","G]L[LF RLPXP RX[XF RN?O@NAM@N?NA RV?W@VAU@V?VA",
            "H[M[MF RV[VPUNSMPMNNMO RI?J@IAH@I?IA RQ?R@QAP@Q?QA","G]L[LF RLPXP RX[XF RL\\N]O_NaLbIb","H[M[MF RV[VPUNSMPMNNMO RM\\O]P_OaMbJb","G]L[LF RLPXP RX[XF RV`UbScQcObN`","H[M[MF RV[VPUNSMPMNNMO RV`UbScQcObN`","MWR[RF RW`VaTbP`NaMb","MWR[RM RRFQGRHSGRFRH RW`VaTbP`NaMb","MWR[RF RN?O@NAM@N?NA RV?W@VAU@V?VA RT9Q<","MWR[RM RNFOGNHMGNFNH RVFWGVHUGVFVH RT>QA","G\\L[LF RX[OO RXFLR RT>QA","IZN[NF RPSV[ RVMNU RPAMD","G\\L[LF RX[OO RXFLR RRbSaR`QaRbR`","IZN[NF RPSV[ RVMNU RRbSaR`QaRbR`","G\\L[LF RX[OO RXFLR RWaMa",
            "IZN[NF RPSV[ RVMNU RWaMa","HYW[M[MF RRbSaR`QaRbR`","MXU[SZRXRF RSbTaS`RaSbS`","HYW[M[MF RH@R@ RRbSaR`QaRbR`","MXU[SZRXRF RM@W@ RSbTaS`RaSbS`","HYW[M[MF RWaMa","MXU[SZRXRF RXaNa","HYW[M[MF RVcR`Nc","MXU[SZRXRF RWcS`Oc","F^K[KFRUYFY[ RT>QA","D`I[IM RIOJNLMOMQNRPR[ RRPSNUMXMZN[P[[ RTEQH","F^K[KFRUYFY[ RR?Q@RAS@R?RA","D`I[IM RIOJNLMOMQNRPR[ RRPSNUMXMZN[P[[ RRFQGRHSGRFRH","F^K[KFRUYFY[ RRbSaR`QaRbR`","D`I[IM RIOJNLMOMQNRPR[ RRPSNUMXMZN[P[[ RRbSaR`QaRbR`","G]L[LFX[XF RR?Q@RAS@R?RA","I\\NMN[ RNOONQMTMVNWPW[ RRFQGRHSGRFRH",
            "G]L[LFX[XF RRbSaR`QaRbR`","I\\NMN[ RNOONQMTMVNWPW[ RRbSaR`QaRbR`","G]L[LFX[XF RWaMa","I\\NMN[ RNOONQMTMVNWPW[ RWaMa","G]L[LFX[XF RVcR`Nc","I\\NMN[ RNOONQMTMVNWPW[ RVcR`Nc","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RMAN@P?TAV@W? RT9Q<","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RMHNGPFTHVGWF RT>QA","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RMAN@P?TAV@W? RN:O;N<M;N:N< RV:W;V<U;V:V<","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RMHNGPFTHVGWF RN?O@NAM@N?NA RV?W@VAU@V?VA","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RM@W@ RP9S<",
            "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RMGWG RP>SA","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RM@W@ RT9Q<","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RMGWG RT>QA","G\\L[LFTFVGWHXJXMWOVPTQLQ RT>QA","H[MMMb RMNOMSMUNVOWQWWVYUZS[O[MZ RTEQH","G\\L[LFTFVGWHXJXMWOVPTQLQ RR?Q@RAS@R?RA","H[MMMb RMNOMSMUNVOWQWWVYUZS[O[MZ RRFQGRHSGRFRH","G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ RR?Q@RAS@R?RA","KXP[PM RPQQORNTMVM RSFRGSHTGSFSH","G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ RRbSaR`QaRbR`","KXP[PM RPQQORNTMVM RPbQaP`OaPbP`",
            "G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ RM@W@ RRbSaR`QaRbR`","KXP[PM RPQQORNTMVM RNGXG RPbQaP`OaPbP`","G\\X[QQ RL[LFTFVGWHXJXMWOVPTQLQ RWaMa","KXP[PM RPQQORNTMVM RUaKa","H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RR?Q@RAS@R?RA","J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RRFQGRHSGRFRH","H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RRbSaR`QaRbR`","J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RRbSaR`QaRbR`","H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RU>RA RM>N?M@L?M>M@","J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RUERH RMENFMGLFMEMG",
            "H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RN>RAV> RR:Q;R<S;R:R<","J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RNERHVE RR?Q@RAS@R?RA","H\\LZO[T[VZWYXWXUWSVRTQPPNOMNLLLJMHNGPFUFXG RR?Q@RAS@R?RA RRbSaR`QaRbR`","J[NZP[T[VZWXWWVUTTQTOSNQNPONQMTMVN RRFQGRHSGRFRH RRbSaR`QaRbR`","JZLFXF RR[RF RR?Q@RAS@R?RA","MYOMWM RRFRXSZU[W[ RR?Q@RAS@R?RA","JZLFXF RR[RF RRbSaR`QaRbR`","MYOMWM RRFRXSZU[W[ RTbUaT`SaTbT`","JZLFXF RR[RF RWaMa","MYOMWM RRFRXSZU[W[ RYaOa","JZLFXF RR[RF RVcR`Nc","MYOMWM RRFRXSZU[W[ RXcT`Pc",
            "G]LFLWMYNZP[T[VZWYXWXF RVbUaV`WaVbV` RNbMaN`OaNbN`","H[VMV[ RMMMXNZP[S[UZVY RVbUaV`WaVbV` RNbMaN`OaNbN`","G]LFLWMYNZP[T[VZWYXWXF RW`VaTbP`NaMb","H[VMV[ RMMMXNZP[S[UZVY RW`VaTbP`NaMb","G]LFLWMYNZP[T[VZWYXWXF RVcR`Nc","H[VMV[ RMMMXNZP[S[UZVY RVcR`Nc","G]LFLWMYNZP[T[VZWYXWXF RMAN@P?TAV@W? RT9Q<","H[VMV[ RMMMXNZP[S[UZVY RMHNGPFTHVGWF RT>QA","G]LFLWMYNZP[T[VZWYXWXF RM@W@ RN:O;N<M;N:N< RV:W;V<U;V:V<","H[VMV[ RMMMXNZP[S[UZVY RMGWG RN?O@NAM@N?NA RV?W@VAU@V?VA","I[KFR[YF RMAN@P?TAV@W?","JZMMR[WM RMHNGPFTHVGWF",
            "I[KFR[YF RRbSaR`QaRbR`","JZMMR[WM RRbSaR`QaRbR`","F^IFN[RLV[[F RP>SA","G]JMN[RQV[ZM RPESH","F^IFN[RLV[[F RT>QA","G]JMN[RQV[ZM RTEQH","F^IFN[RLV[[F RN?O@NAM@N?NA RV?W@VAU@V?VA","G]JMN[RQV[ZM RNFOGNHMGNFNH RVFWGVHUGVFVH","F^IFN[RLV[[F RR?Q@RAS@R?RA","G]JMN[RQV[ZM RRFQGRHSGRFRH","F^IFN[RLV[[F RRbSaR`QaRbR`","G]JMN[RQV[ZM RRbSaR`QaRbR`","H\\KFY[ RYFK[ RR?Q@RAS@R?RA","IZL[WM RLMW[ RRFQGRHSGRFRH","H\\KFY[ RYFK[ RN?O@NAM@N?NA RV?W@VAU@V?VA","IZL[WM RLMW[ RNFOGNHMGNFNH RVFWGVHUGVFVH","I[RQR[ RKFRQYF RR?Q@RAS@R?RA",
            "JZMMR[ RWMR[P`OaMb RRFQGRHSGRFRH","H\\KFYFK[Y[ RNAR>VA","IZLMWML[W[ RNHREVH","H\\KFYFK[Y[ RRbSaR`QaRbR`","IZLMWML[W[ RRbSaR`QaRbR`","H\\KFYFK[Y[ RWaMa","IZLMWML[W[ RWaMa","H[M[MF RV[VPUNSMPMNNMO RWaMa","MYOMWM RRFRXSZU[W[ RN?O@NAM@N?NA RV?W@VAU@V?VA","G]JMN[RQV[ZM RRHPGOEPCRBTCUETGRH","JZMMR[ RWMR[P`OaMb RRHPGOEPCRBTCUETGRH","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RWJYIZGYEWD","MYR[RISGUFWF RT?S@TAU@T?TA","MYR[RISGUFWF ROSUO","MYR[RISGUFWF ROLUL","E^J[JLKIMGPFZFSNVNXOYPZRZWYYXZV[R[PZOY",
            "H[SMPMNNMOLQLWMYNZP[S[UZVYWWWQVOUNSMPLNKMINGPFTFVG","I[MUWU RK[RFY[ RRbSaR`QaRbR`","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RRbSaR`QaRbR`","I[MUWU RK[RFY[ RRAT?U=T;R:P:","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RRHTFUDTBRAPA","I[MUWU RK[RFY[ RU>X; RNAR>VA","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RUEXB RNHREVH","I[MUWU RK[RFY[ RO>L; RNAR>VA","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR ROELB RNHREVH","I[MUWU RK[RFY[ RNAR>VA RXAZ?[=Z;X:V:","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNHREVH RXHZF[DZBXAVA",
            "I[MUWU RK[RFY[ RNAR>VA RM<N;P:T<V;W:","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNHREVH RMAN@P?TAV@W?","I[MUWU RK[RFY[ RNAR>VA RRbSaR`QaRbR`","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNHREVH RRbSaR`QaRbR`","I[MUWU RK[RFY[ RN>O@QASAU@V> RT9Q<","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNEOGQHSHUGVE RT>QA","I[MUWU RK[RFY[ RN>O@QASAU@V> RP9S<","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNEOGQHSHUGVE RP>SA","I[MUWU RK[RFY[ RN>O@QASAU@V> RP>R<S:R8P7N7","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNEOGQHSHUGVE RPERCSAR?P>N>",
            "I[MUWU RK[RFY[ RN>O@QASAU@V> RM<N;P:T<V;W:","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNEOGQHSHUGVE RMAN@P?TAV@W?","I[MUWU RK[RFY[ RN>O@QASAU@V> RRbSaR`QaRbR`","I\\W[WPVNTMPMNN RWZU[P[NZMXMVNTPSUSWR RNEOGQHSHUGVE RRbSaR`QaRbR`","H[MPTP RW[M[MFWF RRbSaR`QaRbR`","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RRbSaR`QaRbR`","H[MPTP RW[M[MFWF RRAT?U=T;R:P:","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RRHTFUDTBRAPA","H[MPTP RW[M[MFWF RMAN@P?TAV@W?","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RMHNGPFTHVGWF","H[MPTP RW[M[MFWF RU>X; RNAR>VA",
            "I[VZT[P[NZMXMPNNPMTMVNWPWRMT RUEXB RNHREVH","H[MPTP RW[M[MFWF RO>L; RNAR>VA","I[VZT[P[NZMXMPNNPMTMVNWPWRMT ROELB RNHREVH","H[MPTP RW[M[MFWF RNAR>VA RXAZ?[=Z;X:V:","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNHREVH RXHZF[DZBXAVA","H[MPTP RW[M[MFWF RNAR>VA RM<N;P:T<V;W:","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNHREVH RMAN@P?TAV@W?","H[MPTP RW[M[MFWF RNAR>VA RRbSaR`QaRbR`","I[VZT[P[NZMXMPNNPMTMVNWPWRMT RNHREVH RRbSaR`QaRbR`","MWR[RF RRAT?U=T;R:P:","MWR[RM RRHTFUDTBRAPA","MWR[RF RRbSaR`QaRbR`","MWR[RM RRFQGRHSGRFRH RRbSaR`QaRbR`",
            "G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RRbSaR`QaRbR`","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RRbSaR`QaRbR`","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RRAT?U=T;R:P:","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RRHTFUDTBRAPA","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RU>X; RNAR>VA","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RUEXB RNHREVH","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RO>L; RNAR>VA","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ ROELB RNHREVH","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RNAR>VA RXAZ?[=Z;X:V:",
            "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNHREVH RXHZF[DZBXAVA","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RNAR>VA RM<N;P:T<V;W:","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNHREVH RMAN@P?TAV@W?","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RNAR>VA RRbSaR`QaRbR`","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RNHREVH RRbSaR`QaRbR`","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RVGXFYDXBWA RT>QA","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RUNWMXKWIVH RTEQH","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RVGXFYDXBWA RP>SA",
            "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RUNWMXKWIVH RPESH","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RVGXFYDXBWA RRAT?U=T;R:P:","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RUNWMXKWIVH RRHTFUDTBRAPA","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RVGXFYDXBWA RWAVBTCPANBMC","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RUNWMXKWIVH RWHVITJPHNIMJ","G]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RVGXFYDXBWA RRbSaR`QaRbR`","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RUNWMXKWIVH RRbSaR`QaRbR`","G]LFLWMYNZP[T[VZWYXWXF RRbSaR`QaRbR`","H[VMV[ RMMMXNZP[S[UZVY RRbSaR`QaRbR`",
            "G]LFLWMYNZP[T[VZWYXWXF RRAT?U=T;R:P:","H[VMV[ RMMMXNZP[S[UZVY RRHTFUDTBRAPA","G]LFLWMYNZP[T[VZWYXWXF RXFZE[CZAY@ RT>QA","H[VMV[ RMMMXNZP[S[UZVY RVMXLYJXHWG RTEQH","G]LFLWMYNZP[T[VZWYXWXF RXFZE[CZAY@ RP>SA","H[VMV[ RMMMXNZP[S[UZVY RVMXLYJXHWG RPESH","G]LFLWMYNZP[T[VZWYXWXF RXFZE[CZAY@ RRAT?U=T;R:P:","H[VMV[ RMMMXNZP[S[UZVY RVMXLYJXHWG RRHTFUDTBRAPA","G]LFLWMYNZP[T[VZWYXWXF RXFZE[CZAY@ RWAVBTCPANBMC","H[VMV[ RMMMXNZP[S[UZVY RVMXLYJXHWG RWHVITJPHNIMJ","G]LFLWMYNZP[T[VZWYXWXF RXFZE[CZAY@ RRbSaR`QaRbR`",
            "H[VMV[ RMMMXNZP[S[UZVY RVMXLYJXHWG RRbSaR`QaRbR`","I[RQR[ RKFRQYF RP>SA","JZMMR[ RWMR[P`OaMb RPESH","I[RQR[ RKFRQYF RRbSaR`QaRbR`","JZMMR[ RWMR[P`OaMb RVbWaV`UaVbV`","I[RQR[ RKFRQYF RRAT?U=T;R:P:","JZMMR[ RWMR[P`OaMb RRHTFUDTBRAPA","I[RQR[ RKFRQYF RMAN@P?TAV@W?","JZMMR[ RWMR[P`OaMb RMHNGPFTHVGWF","E\\PFP[ RJFJ[Z[","J[MMWM ROFOXPZR[ RX[VZUXUF","G]QFOGMJLMLWMYNZP[T[VZXXYVYTXPVMUL","H[QMONNOMQMWNYOZQ[S[UZVYWWWUVSURSQ","G[KFRT RYFRTPXOZM[KZJXKVMUOVPX","JZMMR[ RWMR[Q_PaNbLaK_L]N\\P]Q_",
            "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RQHRHSGSE","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RQEQGRHSH","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RTEWH RMHNHOGOE","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RTEWH RMEMGNHOH","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RXEUH RMHNHOGOE","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RXEUH RMEMGNHOH","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RQHRHSGSE RMAN@P?TAV@W?","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RQEQGRHSH RMAN@P?TAV@W?","G[MUWU RK[RFY[ RJHKHLGLE",
            "G[MUWU RK[RFY[ RJEJGKHLH","?[MUWU RK[RFY[ RIELH RBHCHDGDE","?[MUWU RK[RFY[ RIELH RBEBGCHDH","?[MUWU RK[RFY[ RMEJH RBHCHDGDE","?[MUWU RK[RFY[ RMEJH RBEBGCHDH","D[MUWU RK[RFY[ RFAG@I?MAO@P? RJHKHLGLE","D[MUWU RK[RFY[ RFAG@I?MAO@P? RJEJGKHLH","IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN RQHRHSGSE","IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN RQEQGRHSH","IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN RTEWH RMHNHOGOE","IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN RTEWH RMEMGNHOH","IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN RXEUH RMHNHOGOE",
            "IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN RXEUH RMEMGNHOH","F^K[KFYFY[K[","F^K[KFYFY[K[","B[MPTP RW[M[MFWF REHFHGGGE","B[MPTP RW[M[MFWF REEEGFHGH",":[MPTP RW[M[MFWF RDEGH R=H>H?G?E",":[MPTP RW[M[MFWF RDEGH R=E=G>H?H",":[MPTP RW[M[MFWF RHEEH R=H>H?G?E",":[MPTP RW[M[MFWF RHEEH R=E=G>H?H","F^K[KFYFY[K[","F^K[KFYFY[K[","I\\NMN[ RNOONQMTMVNWPWb RQHRHSGSE","I\\NMN[ RNOONQMTMVNWPWb RQEQGRHSH","I\\NMN[ RNOONQMTMVNWPWb RTEWH RMHNHOGOE","I\\NMN[ RNOONQMTMVNWPWb RTEWH RMEMGNHOH","I\\NMN[ RNOONQMTMVNWPWb RXEUH RMHNHOGOE",
            "I\\NMN[ RNOONQMTMVNWPWb RXEUH RMEMGNHOH","I\\NMN[ RNOONQMTMVNWPWb RQHRHSGSE RMAN@P?TAV@W?","I\\NMN[ RNOONQMTMVNWPWb RQEQGRHSH RMAN@P?TAV@W?","A]L[LF RLPXP RX[XF RDHEHFGFE","A]L[LF RLPXP RX[XF RDEDGEHFH","9]L[LF RLPXP RX[XF RCEFH R<H=H>G>E","9]L[LF RLPXP RX[XF RCEFH R<E<G=H>H","9]L[LF RLPXP RX[XF RGEDH R<H=H>G>E","9]L[LF RLPXP RX[XF RGEDH R<E<G=H>H",">]L[LF RLPXP RX[XF R@AA@C?GAI@J? RDHEHFGFE",">]L[LF RLPXP RX[XF R@AA@C?GAI@J? RDEDGEHFH","MXRMRXSZU[ RQHRHSGSE","MXRMRXSZU[ RQEQGRHSH","MXRMRXSZU[ RTEWH RMHNHOGOE",
            "MXRMRXSZU[ RTEWH RMEMGNHOH","MXRMRXSZU[ RXEUH RMHNHOGOE","MXRMRXSZU[ RXEUH RMEMGNHOH","MXRMRXSZU[ RQHRHSGSE RMAN@P?TAV@W?","MXRMRXSZU[ RQEQGRHSH RMAN@P?TAV@W?","GWR[RF RJHKHLGLE","GWR[RF RJEJGKHLH","?WR[RF RIELH RBHCHDGDE","?WR[RF RIELH RBEBGCHDH","?WR[RF RMEJH RBHCHDGDE","?WR[RF RMEJH RBEBGCHDH","DWR[RF RFAG@I?MAO@P? RJHKHLGLE","DWR[RF RFAG@I?MAO@P? RJEJGKHLH","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RQHRHSGSE","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RQEQGRHSH","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RTEWH RMHNHOGOE",
            "H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RTEWH RMEMGNHOH","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RXEUH RMHNHOGOE","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RXEUH RMEMGNHOH","F^K[KFYFY[K[","F^K[KFYFY[K[","B]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF REHFHGGGE","B]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF REEEGFHGH",":]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RDEGH R=H>H?G?E",":]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RDEGH R=E=G>H?H",":]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RHEEH R=H>H?G?E",":]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RHEEH R=E=G>H?H",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","H[MMMXNZP[S[UZVYWWWPVNUM RQHRHSGSE","H[MMMXNZP[S[UZVYWWWPVNUM RQEQGRHSH","H[MMMXNZP[S[UZVYWWWPVNUM RTEWH RMHNHOGOE","H[MMMXNZP[S[UZVYWWWPVNUM RTEWH RMEMGNHOH","H[MMMXNZP[S[UZVYWWWPVNUM RXEUH RMHNHOGOE","H[MMMXNZP[S[UZVYWWWPVNUM RXEUH RMEMGNHOH","H[MMMXNZP[S[UZVYWWWPVNUM RQHRHSGSE RMAN@P?TAV@W?","H[MMMXNZP[S[UZVYWWWPVNUM RQEQGRHSH RMAN@P?TAV@W?","F^K[KFYFY[K[","@[RQR[ RKFRQYF RCECGDHEH","F^K[KFYFY[K[","8[RQR[ RKFRQYF RBEEH R;E;G<H=H","F^K[KFYFY[K[","8[RQR[ RKFRQYF RFECH R;E;G<H=H",
            "F^K[KFYFY[K[","=[RQR[ RKFRQYF R?A@@B?FAH@I? RCECGDHEH","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RQHRHSGSE","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RQEQGRHSH","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RTEWH RMHNHOGOE","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RTEWH RMEMGNHOH","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RXEUH RMHNHOGOE","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RXEUH RMEMGNHOH","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RQHRHSGSE RMAN@P?TAV@W?",
            "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RQEQGRHSH RMAN@P?TAV@W?","@^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RCHDHEGEE","@^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RCECGDHEH","8^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RBEEH R;H<H=G=E","8^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RBEEH R;E;G<H=H","8^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RFECH R;H<H=G=E","8^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RFECH R;E;G<H=H","=^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ R?A@@B?FAH@I? RCHDHEGEE",
            "=^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ R?A@@B?FAH@I? RCECGDHEH","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RTEQH","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RTEQH","IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN RTEQH","IZPTNUMWMXNZP[T[VZ RRTPTNSMQMPNNPMTMVN RTEQH","I\\NMN[ RNOONQMTMVNWPWb RTEQH","I\\NMN[ RNOONQMTMVNWPWb RTEQH","MXRMRXSZU[ RTEQH","MXRMRXSZU[ RTEQH","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RTEQH","H[P[NZMYLWLQMONNPMSMUNVOWQWWVYUZS[P[ RTEQH","H[MMMXNZP[S[UZVYWWWPVNUM RTEQH","H[MMMXNZP[S[UZVYWWWPVNUM RTEQH",
            "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RTEQH","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RTEQH","F^K[KFYFY[K[","F^K[KFYFY[K[","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RQHRHSGSE RR`RcSdTd","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RQEQGRHSH RR`RcSdTd","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RTEWH RMHNHOGOE RR`RcSdTd","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RTEWH RMEMGNHOH RR`RcSdTd","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RXEUH RMHNHOGOE RR`RcSdTd",
            "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RXEUH RMEMGNHOH RR`RcSdTd","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RQHRHSGSE RMAN@P?TAV@W? RR`RcSdTd","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RQEQGRHSH RMAN@P?TAV@W? RR`RcSdTd","G[MUWU RK[RFY[ RJHKHLGLE RR`RcSdTd","G[MUWU RK[RFY[ RJEJGKHLH RR`RcSdTd","?[MUWU RK[RFY[ RIELH RBHCHDGDE RR`RcSdTd","?[MUWU RK[RFY[ RIELH RBEBGCHDH RR`RcSdTd","?[MUWU RK[RFY[ RMEJH RBHCHDGDE RR`RcSdTd","?[MUWU RK[RFY[ RMEJH RBEBGCHDH RR`RcSdTd","D[MUWU RK[RFY[ RFAG@I?MAO@P? RJHKHLGLE RR`RcSdTd",
            "D[MUWU RK[RFY[ RFAG@I?MAO@P? RJEJGKHLH RR`RcSdTd","I\\NMN[ RNOONQMTMVNWPWb RQHRHSGSE RN`NcOdPd","I\\NMN[ RNOONQMTMVNWPWb RQEQGRHSH RN`NcOdPd","I\\NMN[ RNOONQMTMVNWPWb RTEWH RMHNHOGOE RN`NcOdPd","I\\NMN[ RNOONQMTMVNWPWb RTEWH RMEMGNHOH RN`NcOdPd","I\\NMN[ RNOONQMTMVNWPWb RXEUH RMHNHOGOE RN`NcOdPd","I\\NMN[ RNOONQMTMVNWPWb RXEUH RMEMGNHOH RN`NcOdPd","I\\NMN[ RNOONQMTMVNWPWb RQHRHSGSE RMAN@P?TAV@W? RN`NcOdPd","I\\NMN[ RNOONQMTMVNWPWb RQEQGRHSH RMAN@P?TAV@W? RN`NcOdPd","N]L[LF RLPXP RX[XF RR`RcSdTd",
            "A]L[LF RLPXP RX[XF RDEDGEHFH RR`RcSdTd","9]L[LF RLPXP RX[XF RCEFH R<H=H>G>E RR`RcSdTd","9]L[LF RLPXP RX[XF RCEFH R<E<G=H>H RR`RcSdTd","9]L[LF RLPXP RX[XF RGEDH R<H=H>G>E RR`RcSdTd","9]L[LF RLPXP RX[XF RGEDH R<E<G=H>H RR`RcSdTd",">]L[LF RLPXP RX[XF R@AA@C?GAI@J? RDHEHFGFE RR`RcSdTd",">]L[LF RLPXP RX[XF R@AA@C?GAI@J? RDEDGEHFH RR`RcSdTd","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RQHRHSGSE RR`RcSdTd","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RQEQGRHSH RR`RcSdTd",
            "G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RTEWH RMHNHOGOE RR`RcSdTd","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RTEWH RMEMGNHOH RR`RcSdTd","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RXEUH RMHNHOGOE RR`RcSdTd","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RXEUH RMEMGNHOH RR`RcSdTd","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RQHRHSGSE RMAN@P?TAV@W? RR`RcSdTd","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RQEQGRHSH RMAN@P?TAV@W? RR`RcSdTd","@^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RCHDHEGEE RR`RcSdTd",
            "@^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RCECGDHEH RR`RcSdTd","8^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RBEEH R;H<H=G=E RR`RcSdTd","8^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RBEEH R;E;G<H=H RR`RcSdTd","8^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RFECH R;H<H=G=E RR`RcSdTd","8^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RFECH R;E;G<H=H RR`RcSdTd","=^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ R?A@@B?FAH@I? RCHDHEGEE RR`RcSdTd","=^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ R?A@@B?FAH@I? RCECGDHEH RR`RcSdTd",
            "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RNEOGQHSHUGVE","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RMGWG","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RPESH RR`RcSdTd","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RR`RcSdTd","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RTEQH RR`RcSdTd","F^K[KFYFY[K[","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RMHNGPFTHVGWF","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RMHNGPFTHVGWF RR`RcSdTd","I[MUWU RK[RFY[ RN>O@QASAU@V>","I[MUWU RK[RFY[ RM@W@","G[MUWU RK[RFY[ RIELH",
            "G[MUWU RK[RFY[ RMEJH","I[MUWU RK[RFY[ RR`RcSdTd","NVQHRHSGSE","NVR`RcSdTd","NVQHRHSGSE","KZMHNGPFTHVGWF","LXMCNBPATCVBWA RNFOGNHMGNFNH RVFWGVHUGVFVH","I\\NMN[ RNOONQMTMVNWPWb RPESH RN`NcOdPd","I\\NMN[ RNOONQMTMVNWPWb RN`NcOdPd","I\\NMN[ RNOONQMTMVNWPWb RTEQH RN`NcOdPd","F^K[KFYFY[K[","I\\NMN[ RNOONQMTMVNWPWb RMHNGPFTHVGWF","I\\NMN[ RNOONQMTMVNWPWb RMHNGPFTHVGWF RN`NcOdPd","B[MPTP RW[M[MFWF RDEGH","B[MPTP RW[M[MFWF RHEEH","A]L[LF RLPXP RX[XF RCEFH","A]L[LF RLPXP RX[XF RGEDH","G]L[LF RLPXP RX[XF RR`RcSdTd",
            "JZTEWH RMHNHOGOE","JZXEUH RMHNHOGOE","NVQHRHSGSE RMAN@P?TAV@W?","MXRMRXSZU[ RNEOGQHSHUGVE","MXRMRXSZU[ RMGWG","MXRMRXSZU[ RNFOGNHMGNFNH RVFWGVHUGVFVH RP>SA","MXRMRXSZU[ RNFOGNHMGNFNH RVFWGVHUGVFVH RT>QA","F^K[KFYFY[K[","F^K[KFYFY[K[","MXRMRXSZU[ RMHNGPFTHVGWF","MXRMRXSZU[ RMCNBPATCVBWA RNFOGNHMGNFNH RVFWGVHUGVFVH","MWR[RF RN>O@QASAU@V>","MWR[RF RM@W@","GWR[RF RIELH","GWR[RF RMEJH","F^K[KFYFY[K[","JZTEWH RMEMGNHOH","JZXEUH RMEMGNHOH","NVQEQGRHSH RMAN@P?TAV@W?","H[MMMXNZP[S[UZVYWWWPVNUM RNEOGQHSHUGVE",
            "H[MMMXNZP[S[UZVYWWWPVNUM RMGWG","H[MMMXNZP[S[UZVYWWWPVNUM RNFOGNHMGNFNH RVFWGVHUGVFVH RP>SA","H[MMMXNZP[S[UZVYWWWPVNUM RNFOGNHMGNFNH RVFWGVHUGVFVH RT>QA","H\\MbMQNOONQMTMVNWOXQXWWYVZT[Q[OZMX RQHRHSGSE","H\\MbMQNOONQMTMVNWOXQXWWYVZT[Q[OZMX RQEQGRHSH","H[MMMXNZP[S[UZVYWWWPVNUM RMHNGPFTHVGWF","H[MMMXNZP[S[UZVYWWWPVNUM RMCNBPATCVBWA RNFOGNHMGNFNH RVFWGVHUGVFVH","I[RQR[ RKFRQYF RN>O@QASAU@V>","I[RQR[ RKFRQYF RM@W@","@[RQR[ RKFRQYF RBEEH","@[RQR[ RKFRQYF RFECH","A\\L[LFTFVGWHXJXMWOVPTQLQ RDEDGEHFH",
            "LXNFOGNHMGNFNH RVFWGVHUGVFVH RP>SA","LXNFOGNHMGNFNH RVFWGVHUGVFVH RT>QA","NVPESH","F^K[KFYFY[K[","F^K[KFYFY[K[","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RPESH RR`RcSdTd","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RR`RcSdTd","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RTEQH RR`RcSdTd","F^K[KFYFY[K[","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RMHNGPFTHVGWF","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RMHNGPFTHVGWF RR`RcSdTd","B]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RDEGH","B]PFTFVGXIYMYTXXVZT[P[NZLXKTKMLINGPF RHEEH",
            "@^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RBEEH","@^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RFECH","F^J[O[OWMVKTJQJLKIMGPFTFWGYIZLZQYTWVUWU[Z[ RR`RcSdTd","NVTEQH","NVQEQGRHSH","F^K[KFYFY[K[","F^","LX","F^","LX","NV","OU","PT","H\\","MW","PT","QS","RR","RR","RR","RR","RR","LXOTUT","LXOTUT","H\\JRZR","LXVTNT","F^IT[T","F^IT[T","H\\ODOb RUDUb","JZJbZb RJ]Z]","MWQGQFRDSC","MWSFSGRIQJ","MWSZS[R]Q^","MWQFQGRISJ","JZUGUFVDWC RMGMFNDOC","JZOFOGNIMJ RWFWGVIUJ","JZOZO[N]M^ RWZW[V]U^","JZUFUGVIWJ RMFMGNIOJ","I[MMWM RRFRb",
            "I[M[W[ RMMWM RRFRb","E_PQPU RQUQQ RRPRV RSUSQ RTQTU RPTRVTT RPRRPTR RPQRPTQUSTURVPUOSPQ","E_PPPV RQQQU RRQRU RSSUS RSRST ROPUSOV RVSOWOOVS","MWRYSZR[QZRYR[","MaRYSZR[QZRYR[ R\\Y]Z\\[[Z\\Y\\[","MkRYSZR[QZRYR[ R\\Y]Z\\[[Z\\Y\\[ RfYgZf[eZfYf[","JZRRQSRTSSRRRT","RR","RR","RR","RR","RR","RR","RR","RR","FjJ[ZF RMFOGPIOKMLKKJIKGMF RcUeVfXeZc[aZ`XaVcU RYZZXYVWUUVTXUZW[YZ","FvJ[ZF RMFOGPIOKMLKKJIKGMF RcUeVfXeZc[aZ`XaVcU RoUqVrXqZo[mZlXmVoU RYZZXYVWUUVTXUZW[YZ","MWTFQL","JZQFNL RWFTL","G]NFKL RTFQL RZFWL","MWPFSL",
            "JZSFVL RMFPL","G]VFYL RPFSL RJFML","LXVcR`Nc","KYUMOSUY","KYOMUSOY","E_LMXY RXMLY RKRLSKTJSKRKT RRYSZR[QZRYR[ RRKSLRMQLRKRM RYRZSYTXSYRYT","MaRYSZR[QZRYR[ RRSQGRFSGRSRF R\\Y]Z\\[[Z\\Y\\[ R\\S[G\\F]G\\S\\F","I[QFQS RQYRZQ[PZQYQ[ RQYRZQ[PZQYQ[ RMGOFTFVGWIWKVMUNSORPQRQS RMGOFTFVGWIWKVMUNSORPQRQS","E_JGZG","OUb`aa^c\\dYeTfPfKeHdFcCaB`","OUBFCEFCHBKAP@T@YA\\B^CaEbF","E_N_VW RV_R[","CaKRKW RRFRK RYRYW RFUKWPU RH[KWN[ RMIRKWI ROORKUO RTUYW^U RV[YW\\[","LXOTUT","G][EI`","KYQSVS RVbQbQDVD","KYSSNS RNbSbSDND",
            "ImQYRZQ[PZQYQ[ RMGOFTFVGWIWKVMUNSORPQRQS RcYdZc[bZcYc[ R_GaFfFhGiIiKhMgNeOdPcRcS","IeQYRZQ[PZQYQ[ RMGOFTFVGWIWKVMUNSORPQRQS R`YaZ`[_Z`Y`[ R`S_G`FaG`S`F","MiRYSZR[QZRYR[ RRSQGRFSGRSRF R_Y`Z_[^Z_Y_[ R[G]FbFdGeIeKdMcNaO`P_R_S","KYNMVMPb","G^NMN[ RUMUXVZX[ RJMWMYNZP","H\\NQNU RWPWV RPVPPOQOUPV RQPPPNQMSNUPVQVQP","H\\VQVU RMPMV RTVTPUQUUTV RSPTPVQWSVUTVSVSP","JZR[RV RWXRVMX RURRVOR","MWQZQ[R]S^ RRNQORPSORNRP","OUBFCEFCHBKAP@T@YA\\B^CaEbF Rb`aa^c\\dYeTfPfKeHdFcCaB`","JZRFRK RMIRKWI ROORKUO RRFRK RWIRKMI RUORKOO",
            "JZM^WB RNFOGNHMGNFNH RVYWZV[UZVYV[","E_JSKRNQQRSTVUYTZS",">fB^B]C[EZOZQYRWSYUZ_Za[b]b^","E_JSZS RR[RK RLMXY RXMLY","E_LRMSLTKSLRLT RXYYZX[WZXYX[ RXKYLXMWLXKXM","D`KFHL RQFNL RWFTL R]FZL","E_KRLSKTJSKRKT RRYSZR[QZRYR[ RRKSLRMQLRKRM RYRZSYTXSYRYT","E_LXMYLZKYLXLZ RLLMMLNKMLLLN RRRSSRTQSRRRT RXXYYXZWYXXXZ RXLYMXNWMXLXN","MWRYSZR[QZRYR[ RRNSORPQORNRP","E_KRLSKTJSKRKT RRYSZR[QZRYR[ RRKSLRMQLRKRM RYRZSYTXSYRYT","E_JSZS RR[RK RLXMYLZKYLXLZ RLLMMLNKMLLLN RXXYYXZWYXXXZ RXLYMXNWMXLXN",
            "CaR\\S]R^Q]R\\R^ RRRSSRTQSRRRT RRHSIRJQIRHRJ","CaR^S_R`Q_R^R` RRVSWRXQWRVRX RRNSORPQORNRP RRFSGRHQGRFRH","OU","RR","RR","RR","RR","RR","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","RR","RR","RR","RR","RR","RR","JZQ@S@UAVDVJUMSNQNOMNJNDOAQ@","NVRDRN RR=Q>R?S>R=R?","F^K[KFYFY[K[","F^K[KFYFY[K[","JZUFUN RQ@NJWJ","JZV@O@NFPESEUFVHVKUMSNPNNM","JZNHOFQESEUFVHVKUMSNQNOMNKNFOCPAR@U@","JZM@W@PN","JZQFOENCOAQ@S@UAVCUESFQFOGNINKOMQNSNUMVKVIUGSF","JZVFUHSIQIOHNFNCOAQ@S@UAVCVHUKTMRNON",
            "I[LHXH RRBRN","I[LHXH","I[LJXJ RLFXF","MWT=S>RAQFQJROSRTS","MWP=Q>RASFSJROQRPS","KZODON ROEQDSDUEVGVN","JZQSSSUTVWV]U`SaQaO`N]NWOTQS","JZVaNa RNVPURSRa","JZNTPSSSUTVVVXUZNaVa","JZNSVSRXSXUYV[V^U`SaPaN`","JZUYUa RQSN]W]","JZVSOSNYPXSXUYV[V^U`SaPaN`","JZN[OYQXSXUYV[V^U`SaQaO`N^NYOVPTRSUS","JZMSWSPa","JZQYOXNVOTQSSSUTVVUXSYQYOZN\\N^O`QaSaU`V^V\\UZSY","JZVYU[S\\Q\\O[NYNVOTQSSSUTVVV[U^T`RaOa","I[L[X[ RRURa","I[L[X[","I[L]X] RLYXY","MWTPSQRTQYQ]RbSeTf","MWPPQQRTSYS]RbQePf","RR",
            "KZOXQWSWUXVZVa RV`TaQaO`N^O\\Q[V[","LYV`TaRaP`O^OZPXRWSWUXVZV[O\\","KYQaO`N^NZOXQWSWUXVZV^U`SaQa","KYNWVa RVWNa","LYOXQWSWUXVZV^U`SaRaP`O^O]V\\","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F[XMPMP[X[ RTGRFNFLGKHJJJPKRLSNTUT","F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RSBG_ RZBN_","F[WYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH RR[RM RRQSOTNVMXM","HZTPMP RM[MFWF RJVRV","H[LMTM RL[W[ RO[OIPGRFUFWG RLSTS",
            "D`I[IM RIOJNLMOMQNRPR[ RRPSNUMXMZN[P[[ RWHM`","G]L[LFX[XF RHV\\V RHP\\P","GyL[LFTFVGWHXJXMWOVPTQLQ R^MfM RaFaXbZd[f[ RlZn[r[tZuXuWtUrToTmSlQlPmNoMrMtN","GmX[QQ RL[LFTFVGWHXJXMWOVPTQLQ R`Zb[f[hZiXiWhUfTcTaS`Q`PaNcMfMhN","F^IFN[RLV[[F RHV\\V RHP\\P","D`I[IFOFRGTIULUR RONOUPXRZU[[[[F","I\\W[WF RWZU[Q[OZNYMWMQNOONQMUMWN RRHZH RXaNa","F[HSQS RHNTN RWYVZS[Q[NZLXKVJRJOKKLINGQFSFVGWH","G\\L[LF RX[OO RXFLR RLOTO","JZLFXF RR[RF ROVUR ROPUL","IoK[RFY[K[ R`b`QaObNdMgMiNjOkQkWjYiZg[d[bZ`X",
            "G]ITJSLRNSOTQUSTXOYLYIXGVFUFSGRIRLSOXTYVYWXYWZT[","G\\L[LFTFVGWHXJXMWOVPTQLQ RHL\\L","F[VGTFQFNGLIKKJOJRKVLXNZQ[S[VZWYWRSR RRCR^","I[K[RFY[ RHV\\V RHP\\P","H\\XZU[P[NZMYLWLUMSNRPQTPVOWNXLXJWHVGTFOFLG RRCR^","HZVZT[P[NZMYLWLQMONNPMTMVN RRJR^","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","E_ZSJS RNWJSNO","E_R[RK RNORKVO","E_JSZS RVWZSVO",
            "E_RKR[ RVWR[NW","E_JSZS RVWZSVO RNOJSNW","E_R[RK RNORKVO RVWR[NW","E_KLYZ RRLKLKS","E_YLKZ RRLYLYS","E_YZKL RRZYZYS","E_KZYL RRZKZKS","E_ZSJS RRWVO RNOJSNW","E_JSZS RRONW RVWZSVO","E_JWJQPQ RJQMTOUQTSRUQWRZU","E_ZWZQTQ RZQWTUUSTQROQMRJU","E_ZSJS RTOPSTW RNWJSNO","E_R[RK RNURQVU RNORKVO","E_JSZS RPOTSPW RVWZSVO","E_RKR[ RVQRUNQ RVWR[NW","E_JSVS RZOVSZW RNWJSNO","E_ZSNS RJONSJW RVWZSVO","E_ZOZW RJSZS RNWJSNO","E_R[RK RV[N[ RNORKVO","E_JOJW RZSJS RVWZSVO","E_RKR[ RNKVK RVWR[NW","E_N[V[ RR[RK RNWR[VW RNORKVO",
            "E_NWJSNO RJSWSYRZPYNWM","E_VWZSVO RZSMSKRJPKNMM","E_NWJSNO RJSWSYRZPYNWMUNTPTW","E_VWZSVO RZSMSKRJPKNMMONPPPW","E_PUJUJO RZWZQTQ RZQWTUUSTQROQMRJU","E_JSZS RTOPW RNOJSNW RVWZSVO","E_PWR[VY ROKLTVOR[","E_V[VOJO RNSJONK","E_N[NOZO RVSZOVK","E_VKVWJW RNSJWN[","E_NKNWZW RVSZWV[","E_JOVOV[ RZWV[RW","E_VKVWJW RNSJWN[","E_OQKUGQ RYRYQXNVLSKQKNLLNKQKU","E_UQYU]Q RKRKQLNNLQKSKVLXNYQYU","E_KLYZ RKHYH RRLKLKS","E_JWZW RJKJS RZSZ[ RZOJO RNSJONK RV[ZWVS","E_[KUKUQ RMMLNKQKSLVNXQYSYVXXVYSYQXNUK",
            "E_IKOKOQ RWMXNYQYSXVVXSYQYNXLVKSKQLNOK","E_ZSJSNO","E_ZSJSNW","E_R[RKVO","E_R[RKNO","E_JSZSVO","E_JSZSVW","E_RKR[VW","E_RKR[NW","E_ZWJW RJOZO RVSZOVK RN[JWNS","E_N[NK RVKV[ RJONKRO RRWV[ZW","E_JWZW RZOJO RNSJONK RV[ZWVS","E_ZWJW RJOZO RN[JWNSJONK","E_N[NK RVKV[ RJONKROVKZO","E_JWZW RZOJO RV[ZWVSZOVK","E_VKV[ RN[NK RZWV[RWN[JW","E_JVZVVZ RZPJPNL","E_ZVJVNZ RJPZPVL","E_ZPMP RZVMV RRXVN ROXJSON","E_MVWV RMPWP RSNQX ROXJSON RUNZSUX","E_JVWV RJPWP RRNNX RUNZSUX","E_ZPMP RZVMV ROXJSON","E_ONO[ RUNU[ RWPRKMP",
            "E_JVWV RJPWP RUNZSUX","E_UXUK ROXOK RMVR[WV","E_MVWV RMPWP ROXJSON RUNZSUX","E_OXON RUXUN RMVR[WV RWPRKMP","E_[XOL RW\\KP RSLKLKT","E_IXUL RM\\YP RQLYLYT","E_INUZ RMJYV RQZYZYR","E_[NOZ RWJKV RSZKZKR","E_ZXOX RZSJS RZNON RQLJSQZ","E_JXUX RJSZS RJNUN RSLZSSZ","E_NWJSNO RZUWQTUQQNULSJS","E_VWZSVO RJUMQPUSQVUXSZS","E_NXVX RNSVS RR[RK RNORKVO","E_VNNN RVSNS RRKR[ RVWR[NW","E_ZSWS RSSQS RMSJS RNOJSNW","E_R[RX RRTRR RRNRK RNORKVO","E_JSMS RQSSS RWSZS RVWZSVO","E_RKRN RRRRT RRXR[ RVWR[NW","E_ZSJS RJWJO RNOJSNW",
            "E_JSZS RZOZW RVWZSVO","E_ZPZVOVOXJSONOPZP","E_U[O[OPMPRKWPUPU[","E_JVJPUPUNZSUXUVJV","E_OKUKUVWVR[MVOVOK","E_U[O[OWUWU[ RUSOSOPMPRKWPUPUS","E_W[M[MWOWOPMPRKWPUPUWWWW[","E_ONUN RW[M[MWOWOPMPRKWPUPUWWWW[","E_RKR[ RW[M[MWOWOPMPRKWPUPUWWWW[","E_PPMPRKWPTP RU[O[OSMSRNWSUSU[","E_PPMPRKWPTP RW[M[MWOWOSMSRNWSUSUWWWW[","E_JNNNNPUPUNZSUXUVNVNXJXJN","E_Z[NO RZKJKJ[ RUONONV","E_JKVW RJ[Z[ZK ROWVWVP","E_MPRKWPUPUVWVR[MVOVOPMP","E_JSZS RVWZSVO RTRTTSVQWOWMVLTLRMPOOQOSPTR","E_V[VK RNKN[ RZOVKRO RRWN[JW",
            "E_J[Z[ RJKZK RZSJS RVGZKVOZSVWZ[V_","E_ZSJS RTWTO RNOJSNW","E_JSZS RPOPW RVWZSVO","E_JSZS RRORW RNOJSNW RVWZSVO","E_ZSJS RWWWO RRWRO RNOJSNW","E_JSZS RMOMW RRORW RVWZSVO","E_JSZS RPOPW RTOTW RNWJSNO RVWZSVO","E_NSZS RNWNOJSNW","E_VSJS RVWVOZSVW","E_NSVS RNWJSNONW RVWVOZSVW","I[MLWL RKFR[YF","HZVHUGSFPFNGMHLKLVMYNZP[S[UZVY","H[WOVNTMPMNNMOLQLWMYNZP[S[UZVYWWWJVHUGSFOFMG","I\\WPPP RM[W[WFMF","I\\WQPQ RMFWFW[M[ RXCL`","C`G[\\F ROFTFXHZJ\\N\\SZWXYT[O[KYIWGSGNIJKHOF","I[K[RFY[K[","I[YFR[KFYF",
            "C`\\QGQ R\\GOGKIIKGOGSIWKYO[\\[","C`[CH^ R\\QGQ R\\GOGKIIKGOGSIWKYO[\\[","E_JSZS RZZPZMYKWJTJRKOMMPLZL","DaHP]P RHZUZYX[V]R]N[JYHUFHF","DaI^\\C RHP]P RHZUZYX[V]R]N[JYHUFHF","E_ZSJS RJZTZWYYWZTZRYOWMTLJL","E_M[WQ RMZWP RMYWO RMXWN RMWWM RMVWL RMUWK RMTVK RMSUK RMRTK RMQSK RMPRK RMOQK RMNPK RMMOK RMLNK RN[WR RO[WS RP[WT RQ[WU RR[WV RS[WW RT[WX RU[WY RV[WZ RM[MKWKW[M[","E_Z`ZFJFJ`","E_ZFZ`J`JF","E_Z`I`TSIF[F","E_JSZS","E_ZWJW RROR_ RJKZK","E_JSZS RR[RK RRDQERFSERDRF","G][EI`","KYID[_","E_KOYW RR[RK RYOKW",
            "E_PQRPTQUSTURVPUOSPQ","E_PQPU RQUQQ RRPRV RSUSQ RTQTU RPTRVTT RPRRPTR RPQRPTQUSTURVPUOSPQ","IbMTQSS[bB","IbMTQSS[bB RN@V@RESEUFVHVKUMSNPNNM","IbMTQSS[bB RUFUN RQ@NJWJ","E_XPWPUQQUOVMULSMQOPQQUUWVXV","E_TQVPXQYSXUVVTUPQNPLQKSLUNVPUTQ","E_JKJ[Z[","E_ZKJ[Z[","E_ZKJ[Z[ RPSRUTZT]","E_Z[JSZK RSYTWUSTOSM","H\\RbRD","H\\NUVQ RRDRb","H\\ODOb RUDUb","H\\LVXP RODOb RUDUb","E_[[RKI[","E_IKR[[K","E_Z[ZQXMTKPKLMJQJ[","E_JKJULYP[T[XYZUZK","H\\L]M_O`Q_R]RISGUFWGXI","D`H]I_K`M_N]NIOGQFSGTI RP]Q_S`U_V]VIWGYF[G\\I",
            "@dD]E_G`I_J]JIKGMFOGPI RL]M_O`Q_R]RISGUFWGXI RT]U_W`Y_Z]ZI[G]F_G`I","H\\L]M_O`Q_R]RISGUFWGXI RRMUNWPXSWVUXRYOXMVLSMPONRM","D`H]I_K`M_N]NIOGQFSGTI RP]Q_S`U_V]VIWGYF[G\\I RVMYN[P\\S[VYXVYNYKXIVHSIPKNNMVM","@dD]E_G`I_J]JIKGMFOGPI RL]M_O`Q_R]RISGUFWGXI RT]U_W`Y_Z]ZI[G]F_G`I RZM]N_P`S_V]XZYJYGXEVDSEPGNJMZM","H\\URXU[R RLSMPONRMUNWPXSXU RL]M_O`Q_R]RISGUFWGXI","H\\UQXT[Q RL]M_O`Q_R]RISGUFWGXI RLSMPONRMUNWPXSWVUXRYOXMVLS","H\\UUXR[U RL]M_O`Q_R]RISGUFWGXI RLSMPONRMUNWPXSWVUXRYOXMVLS","E_KXLYKZJYKXKZ RRLSMRNQMRLRN RYXZYYZXYYXYZ",
            "E_YNXMYLZMYNYL RRZQYRXSYRZRX RKNJMKLLMKNKL","JZRXSYRZQYRXRZ RRLSMRNQMRLRN","E_LXMYLZKYLXLZ RLLMMLNKMLLLN RXXYYXZWYXXXZ RXLYMXNWMXLXN","E_JSZS RRFQGRHSGRFRH","E_JSTS RYXZYYZXYYXYZ RYLZMYNXMYLYN","E_JSZS RLXMYLZKYLXLZ RLLMMLNKMLLLN RXXYYXZWYXXXZ RXLYMXNWMXLXN","E_JSKRNQQRSTVUYTZS RRXSYRZQYRXRZ RRLSMRNQMRLRN","E_JSKRNQQRSTVUYTZS","E_ZSYRVQSRQTNUKTJS","E_WPYQZSYUWVTUPQMPKQJSKUMV","E_JSKNLLNKPLQNSXTZV[XZYXZS","E_RKSLTOSRQTPWQZR[","E_JSKRNQQRSTVUYTZS RVKN[","E_ZPJP RZVYWVXSWQUNTKUJV","E_JVZV RJPKONNQOSQVRYQZP",
            "E_JVZV RJPKONNQOSQVRYQZP RVKN[","E_JYZY RJSZS RJMKLNKQLSNVOYNZM","E_JYZY RJSZS RUPO\\ RJMKLNKQLSNVOYNZM","E_JYZY RJSZS RJMKLNKQLSNVOYNZM RXGL_","E_JVKUNTQUSWVXYWZV RJPKONNQOSQVRYQZP","E_JVKUNTQUSWVXYWZV RJPKONNQOSQVRYQZP RVKN[","E_JYZY RJSKRNQQRSTVUYTZS RJMKLNKQLSNVOYNZM","E_JYKXNWQXSZV[YZZY RJSKRNQQRSTVUYTZS RJMKLNKQLSNVOYNZM","E_ZYJY RZSJS RZMYLVKSLQNNOKNJM","E_JXLWPVTVXWZX RJNLOPPTPXOZN","E_JVNVNWOYQZSZUYVWVVZV RJPNPNOOMQLSLUMVOVPZP","E_ZVJV RJPNPNOOMQLSLUMVOVPZP","E_JPZP RZVJV RRHQIRJSIRHRJ",
            "E_JPZP RZVJV RRXSYRZQYRXRZ RRLSMRNQMRLRN","E_JPZP RZVJV RKJLKKLJKKJKL RYZZ[Y\\X[YZY\\","E_ZPJP RJVZV RYJXKYLZKYJYL RKZJ[K\\L[KZK\\","AcNP^P R^VNV RGVHWGXFWGVGX RGNHOGPFOGNGP","AcVPFP RFVVV R]V\\W]X^W]V]X R]N\\O]P^O]N]P","E_JPZP RZVJV RPQRPTQUSTURVPUOSPQ","E_JPZP RZVJV RRJPIOGPERDTEUGTIRJ","E_JPZP RZVJV RNJOHQGSGUHVJ","E_JPZP RZVJV RNJRGVJ","E_JPZP RZVJV RNGRJVG","E_JPZP RZVJV RRATGOCUCPGRA","E_JPZP RZVJV RR?NJVJR?","E_JPZP RYC]C RZVJV R]?[@ZBZJ RM?MJKJIIHGHEICKBMB RQFVFVCUBRBQCQIRJUJ",
            "E_JPZP RZVJV RMBMJ RMCNBQBRCRJ RRCSBVBWCWJ","E_JPZP RZVJV RRHSIRJQIRHRJ RN@P?S?U@VBUDSE","E_JPZP RTMPY RZVJV","E_JYZY RJSZS RJMZM","E_JYZY RJSZS RJMZM RXGL_","E_J\\Z\\ RJPZP RJJZJ RZVJV","E_ZZJZ RZVJPZJ","E_JZZZ RJVZPJJ","E_J]Z] RZWJW RZSJMZG","E_Z]J] RJWZW RJSZMJG","E_J]Z] RTTP` RZWJW RZSJMZG","E_JWZW RTTP` RZ]J] RJSZMJG","=gRMBSRY RbMRSbY","=gRMbSRY RBMRSBY","I[OCPDRGSITLUQUUTZS]R_PbOc RUcTbR_Q]PZOUOQPLQIRGTDUC","E_JXLWPVTVXWZX RJNLOPPTPXOZN RVKN[","E_ZMJSZY RVKN[","E_JMZSJY RVKN[","E_ZZJZ RZVJPZJ RXGL_",
            "E_JZZZ RJVZPJJ RXGL_","E_ZVJPZJ RJZKYNXQYS[V\\Y[ZZ","E_JVZPJJ RJZKYNXQYS[V\\Y[ZZ","E_ZVJPZJ RJZKYNXQYS[V\\Y[ZZ RXGL_","E_JVZPJJ RJZKYNXQYS[V\\Y[ZZ RXGL_","E_JSZYJ_ RZSJMZG","E_ZSJYZ_ RJSZMJG","E_JSZYJ_ RZSJMZG RXGL_","E_ZSJYZ_ RJSZMJG RXGL_","E_ZKXNVPRRJSRTVVXXZ[","E_JKLNNPRRZSRTNVLXJ[","E_JVRWVYX[Z^ RZHXKVMROJPRQVSXUZX","E_ZVRWNYL[J^ RJHLKNMROZPRQNSLUJX","E_J[KZNYQZS\\V]Y\\Z[ RZHXKVMROJPRQVSXUZX","E_J[KZNYQZS\\V]Y\\Z[ RJXLUNSRQZPRONMLKJH","E_ZKXNVPRRJSRTVVXXZ[ RVKN[","E_JKLNNPRRZSRTNVLXJ[ RVKN[",
            "E_ZMNMLNKOJQJUKWLXNYZY","E_JMVMXNYOZQZUYWXXVYJY","E_ZMNMLNKOJQJUKWLXNYZY RVKN[","E_JMVMXNYOZQZUYWXXVYJY RVKN[","E_J\\Z\\ RZJNJLKKLJNJRKTLUNVZV","E_Z\\J\\ RJJVJXKYLZNZRYTXUVVJV","E_J\\Z\\ RZJNJLKKLJNJRKTLUNVZV RXGL_","E_Z\\J\\ RJJVJXKYLZNZRYTXUVVJV RXGL_","E_J\\Z\\ RZJNJLKKLJNJRKTLUNVZV RSYQ_","E_Z\\J\\ RJJVJXKYLZNZRYTXUVVJV RSYQ_","E_JKJULYP[T[XYZUZK ROSUS RSUUSSQ","E_JKJULYP[T[XYZUZK RRRQSRTSSRRRT","E_JKJULYP[T[XYZUZK RLSXS RRMRY","E_ZYJYJMZM","E_JYZYZMJM","E_Z\\J\\ RZVJVJJZJ","E_J\\Z\\ RJVZVZJJJ","E_Z[ZKJKJ[",
            "E_JKJ[Z[ZK","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RLSXS RRMRY","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RLSXS","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RMNWX RWNMX","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RWFM^","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RRRQSRTSSRRRT","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RPQRPTQUSTURVPUOSPQ","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RRNRS RMQRSWQ ROWRSUW","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RLUXU RLQXQ","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RNSVS","E_JKZKZ[J[JK RLSXS RRMRY","E_JKZKZ[J[JK RLSXS","E_JKZKZ[J[JK RMNWX RWNMX","E_JKZKZ[J[JK RRRQSRTSSRRRT","E_J[JK RJSZS",
            "E_Z[ZK RZSJS","E_ZKJK RRKR[","E_J[Z[ RR[RK","I[NSVS RNKN[","I[NVVV RNPVP RNKN[","E_JVZV RJPZP RJKJ[","E_JKJ[ RPSZS RPKP[","E_JKJ[ ROKO[ RTKT[ RYSTS","E_JKJ[ RPVYV RPPYP RPKP[","E_J[JK RJSZS RXGL_","E_JVZV RJPZP RJKJ[ RXGL_","E_JKJ[ RPSZS RPKP[ RXGL_","E_JKJ[ RPVYV RPPYP RPKP[ RXGL_","E_VKXLYNXPVQRRJSRTVUXVYXXZV[","E_NKLLKNLPNQRRZSRTNULVKXLZN[","E_JSZYZMJS","E_ZSJYJMZS","E_Z[J[ RJQZWZKJQ","E_J[Z[ RZQJWJKZQ","BbXQXU RYQYU RZPZV R[Q[U R\\Q\\U RMSLQJPHQGSHUJVLUMSWSXUZV\\U]S\\QZPXQWS",
            "BbLQLU RKQKU RJPJV RIQIU RHQHU RWSXQZP\\Q]S\\UZVXUWSMSLUJVHUGSHQJPLQMS","E_JSTSUUWVYUZSYQWPUQTS","E_JSNS RR[RW RRKRO RZSVS","I[NFVF RRFR[","E_J[Z[ RZKRVJK","E_ZKJK RJ[RPZ[","E_JKZK RZPR[JP","E_JKJ[Z[ RJOLOQQTTVYV[","E_Z[ZKJ[Z[","Bb_`REE`","BbEFRa_F","Bb]`]O\\KZHWFSEQEMFJHHKGOG`","BbGFGWH[J^M`QaSaW`Z^\\[]W]F","E_RaJSRFZSRa","JZRRQSRTSSRRRT","I[RRTXOTUTPXRR","E_ZSJS RRXSYRZQYRXRZ RRLSMRNQMRLRN RLMXY RXMLY","E_JKZ[ZKJ[JK","E_ZKJ[JKZ[","E_JKZ[ZKJ[","E_JKZ[ RRSJ[","E_ZKJ[ RRSZ[","E_ZVJV RZPYOVNSOQQNRKQJP",
            "E_JKMMOOQSR[SSUOWMZK","E_Z[WYUWSSRKQSOWMYJ[","E_ZPSPQQPSQUSVZV RZ\\Q\\N[KXJUJQKNNKQJZJ","E_JPQPSQTSSUQVJV RJ\\S\\V[YXZUZQYNVKSJJJ","E_U[UTTRRQPROTO[ R[[[RZOWLTKPKMLJOIRI[","E_OKORPTRUTTURUK RIKITJWMZP[T[WZZW[T[K","E_RKR[ RL[LSMPNOQNSNVOWPXSX[","E_JPZP RZVJV RODOb RUDUb","E_ZMJSZY RYRXSYTZSYRYT","E_JMZSJY RKRJSKTLSKRKT","5oJM:SJY RZMJSZY RjMZSjY","5oZMjSZY RJMZSJY R:MJS:Y","E_ZSJS RJWZ[J_ RZOJKZG","E_JSZS RZWJ[Z_ RJOZKJG","E_ZLJL RZPJVZ\\","E_JLZL RJPZVJ\\","E_JPROVMXKZH RZ^X[VYRWJVRUVSXQZN",
            "E_ZPRONMLKJH RJ^L[NYRWZVRUNSLQJN","E_JPROVMXKZH RZ^X[VYRWJVRUVSXQZN RXGL_","E_ZPRONMLKJH RJ^L[NYRWZVRUNSLQJN RXGL_","E_Z\\J\\ RZVJVJJZJ RXGL_","E_J\\Z\\ RJVZVZJJJ RXGL_","E_Z\\J\\ RZVJVJJZJ RSYQ_","E_J\\Z\\ RJVZVZJJJ RSYQ_","E_ZVJPZJ RJZKYNXQYS[V\\Y[ZZ RSWQ]","E_JVZPJJ RJZKYNXQYS[V\\Y[ZZ RSWQ]","E_J[KZNYQZS\\V]Y\\Z[ RZHXKVMROJPRQVSXUZX RSXQ^","E_J[KZNYQZS\\V]Y\\Z[ RJXLUNSRQZPRONMLKJH RSXQ^","E_JSZYZMJS RXGL_","E_ZSJYJMZS RXGL_","E_Z[J[ RJQZWZKJQ RXGL_","E_J[Z[ RZQJWJKZQ RXGL_","CaR\\S]R^Q]R\\R^ RRRSSRTQSRRRT RRHSIRJQIRHRJ",
            "CaHRISHTGSHRHT RRRSSRTQSRRRT R\\R]S\\T[S\\R\\T","Ca\\H[I\\J]I\\H\\J RRRQSRTSSRRRT RH\\G]H^I]H\\H^","CaHHIIHJGIHHHJ RRRSSRTQSRRRT R\\\\]]\\^[]\\\\\\^",">`BQ\\Q R\\GOGKIIKGOGSIWKYO[\\[",">`GQ\\Q R\\M\\U R\\GOGKIIKGOGSIWKYO[\\[","E_JSZS RZPZV RZZPZMYKWJTJRKOMMPLZL","C`\\QGQ R\\GOGKIIKGOGSIWKYO[\\[ RR@QARBSAR@RB","C`GA\\A R\\QGQ R\\[O[KYIWGSGOIKKIOG\\G","E_JSZS RZGJG RZLPLMMKOJRJTKWMYPZZZ","C`G`\\` R\\PGP R\\FOFKHIJGNGRIVKXOZ\\Z","C`HT\\T RHN\\N R\\GOGKIIKGOGSIWKYO[\\[","DfbQHQ RHGUGYI[K]O]S[WYYU[H[",
            "Df]QHQ RHMHU RHGUGYI[K]O]S[WYYU[H[","E_ZSJS RJPJV RJZTZWYYWZTZRYOWMTLJL","Da]AHA RHQ]Q RH[U[YY[W]S]O[KYIUGHG","E_ZSJS RJGZG RJLTLWMYOZRZTYWWYTZJZ","C`GQ\\Q R\\GGGG[\\[","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RZKJ[","E_JQRWROZU","E_J[JORGZOZ[J[","E_NORKVO","E_VWR[NW","E_ZKJK RJ[RPZ[","E_JNZN RJHZH RJ[RSZ[","H\\RDSETGSIRJQLRNSOTQSSRTQVRXSYT[S]R^Q`Rb","KYQbQDVD","KYSbSDND","KYQDQbVb","KYSDSbNb","E_RWR[ RVSZS","E_RWR[ RNSJS","E_RORK RVSZS","E_RORK RNSJS","E_ZQJQJV","D`[JZLYPYVZZ[\\Y[UZOZK[I\\JZKVKPJLIJKKOLULYK[J",
            "E_JSJQLMPKTKXMZQZS","E_JSJQLMPKTKXMZQZS RJSZS","E_JMLLPKTKXLZMR[JM","E_PUJ[ RTKWLYNZQYTWVTWQVOTNQONQLTK","E_JSZS RR[RK RVRUPSOQOOPNRNTOVQWSWUVVTVR","E_JWZW RJOZO RNKN[ RVKV[","E_LPXPZO[MZKXJVKUMUYV[X\\Z[[YZWXVLVJWIYJ[L\\N[OYOMNKLJJKIMJOLP","E_ZUJUJP","E_RORSUS RPKTKXMZQZUXYT[P[LYJUJQLMPK","E_M[RVW[ RN[RWV[ RP[RYT[ RS[RZQ[ RU[RXO[ RYMRPKMROYM RJFZFZKYMKTJVJ[Z[ZVYTKMJJJF","JZVFNFNM","JZNFVFVM","JZV[N[NT","JZN[V[VT","H\\RbRMSITGVFXGYI","H\\RDRYQ]P_N`L_K]","E_JUKTMSRRWSYTZU","E_ZQYRWSRTMSKRJQ","E_LKHK RXK\\K RNORKVO",
            "@dXK^K RFKLKX[^[","AfJKZ[ RZKJ[ RFKZKbSZ[F[FK","AcJKZ[ RZKJ[ RFK^K^[F[FK","9k>VfV R>LfL RCQCL RD[DV REVEQ RFLFG RHQHL RJVJQ RK[KV RKLKG RMQML ROVOQ RPLPG RRQRL RTVTQ RULUG RWQWL RYVYQ RZ[ZV RZLZG R\\Q\\L R^V^Q R_L_G R`[`V R>QaQaL R>[>GfGf[>[","KYUcOSUC","KYOcUSOC",">cZKJ[ RJKZ[ R^KJKBSJ[^[^K","AcKOKW RR[YW RRKYO RRE^L^ZRaFZFLRE","H\\PNKX RYNTX RVRUPSOQOOPNRNTOVQWSWUVVTVR","E_N[J[JW RZSRSJ[ RVRUPSOQOOPNRNTOVQWSWUVVTVR","E_JSZS RNYVY RVMNM","E_RPRKNN RZPZKVN RRKJ[R[ZK","H\\LS[S RRMRY RXP[SXV RVRUPSOQOOPNRNTOVQWSWUVVTVR",
            "E_ZSJ\\JJZS RJSZS","E_J[JRZ[J[","E_JWJ[Z[ZW","E_VWR[NW","D`JaZa RJFZF RRFRa","D`MFWFWaMaMF","D`IF[F[aIaIF RJPZP RZVJV","D`IF[F[aIaIF RZSJS RRXSYRZQYRXRZ RRLSMRNQMRLRN","D`IF[F[aIaIF RRJ[SR\\ISRJ","D`IF[F[aIaIF RPQRPTQUSTURVPUOSPQ","D`IF[F[aIaIF RPKTKXMZQZUXYT[P[LYJUJQLMPK","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RRbRD","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RPQRPTQUSTURVPUOSPQ","E_JSZS RZKJ[","E_JSZS RJKZ[","D`IaIF[F[aIa[F","D`[a[FIFIa[aIF","D`IF[F[aIaIF RZMJSZY","D`IF[F[aIaIF RJMZSJY","E_ZSJS RNWJSNO RR[RK","E_JSZS RVWZSVO RR[RK",
            "D`IF[F[aIaIF RZSJS RNWJSNO","D`IF[F[aIaIF RJSZS RVWZSVO","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RLGX_","E_J[Z[ RR[RK RZaJa","E_RKX[L[RK RRbRD","D`IF[F[aIaIF RIKR[[K","D`IF[F[aIaIF RRKX[L[RK","E_ZKJK RRKR[ RVRUPSOQOOPNRNTOVQWSWUVVTVR","E_R[RK RNORKVO RJSZS","D`IF[F[aIaIF RR[RK RNORKVO","E_ZKJK RRKR[ RMEWE","E_R[LKXKR[ RRbRD","D`IF[F[aIaIF R[[RKI[","D`IF[F[aIaIF RR[LKXKR[","E_J[Z[ RR[RK RPQRPTQUSTURVPUOSPQ","E_RKR[ RVWR[NW RJSZS","D`IF[F[aIaIF RRKR[ RVWR[NW","JZJ]Z] RSFQJ","E_RKX[L[RK RJ]Z]","E_RJ[SR\\ISRJ RJ]Z]",
            "E_PQRPTQUSTURVPUOSPQ RJ]Z]","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RJ]Z]","E_Z[ZQXMTKPKLMJQJ[ RPQRPTQUSTURVPUOSPQ","D`IF[F[aIaIF RSFQJ","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RRPTVORURPVRP","D`IF[F[aIaIF RRYSZR[QZRYR[ RRNSORPQORNRP","E_ZKJK RRKR[ RNDOENFMENDNF RVDWEVFUEVDVF","E_R[LKXKR[ RNFOGNHMGNFNH RVFWGVHUGVFVH","E_RKWZJQZQMZRK RNDOENFMENDNF RVDWEVFUEVDVF","E_PQRPTQUSTURVPUOSPQ RNIOJNKMJNINK RVIWJVKUJVIVK","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RNDOENFMENDNF RVDWEVFUEVDVF","E_JKJULYP[T[XYZUZK RRbRD","E_ZMNMLNKOJQJUKWLXNYZY RRbRD",
            "E_JSKRNQQRSTVUYTZS RNFOGNHMGNFNH RVFWGVHUGVFVH","E_JMZSJY RNFOGNHMGNFNH RVFWGVHUGVFVH","E_JSZS RSZS[R]Q^","E_R[LKXKR[ RJSKRNQQRSTVUYTZS","H\\QFSFUGVHWJXNXSWWVYUZS[Q[OZNYMWLSLNMJNHOGQF RJPKONNQOSQVRYQZP","E_JSKRNQQRSTVUYTZS RRbRD","MWSZS[R]Q^ RRNSORPQORNRP RJ]Z]","D`IF[F[aIaIF RJPZP RTMPY RZVJV","D`IF[F[aIaIF RQYRZQ[PZQYQ[ RMGOFTFVGWIWKVMUNSORPQRQS","E_IKR[[K RJSKRNQQRSTVUYTZS","E_[[RKI[ RJSKRNQQRSTVUYTZS","MXRMRXSZU[","H\\MbMQNOONQMTMVNWOXQXWWYVZT[Q[OZMX","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM",
            "H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[ RJ]Z]","HZLTST RVZT[P[NZMYLWLQMONNPMTMVN RJ]Z]","MXRMRXSZU[ RJ]Z]","G]RTRX RMMLNKPKXLZN[O[QZRXSZU[V[XZYXYPXNWM RJ]Z]","H]YMVWUYTZR[P[NZMYLVLRMONNPMRMTNUOVQWXXZZ[","IbMTQSS[bB RXL`L","A_J_F_F[ RJKJ[Z[ RF_OVEQOG","E_JWNWN[V[VWZW","E_NSN[J[ RVSV[Z[ RJSJQLMPKTKXMZQZSJS","E_PQPU RQUQQ RRPRV RSUSQ RTQTU RPTRVTT RPRRPTR RPQRPTQUSTURVPUOSPQ RRbRD","E_VWR[NW ROEQDSDUEVGVN RVMTNQNOMNKOIQHVH","BbF[^[ RGLIKKKMLNNNU RUSVTUUTTUSUU R]S^T]U\\T]S]U RNTLUIUGTFRGPIONO",
            "BbF[N[ RV[^[ RGLIKKKMLNNNU RWLYK[K]L^N^U RNTLUIUGTFRGPIONO R^T\\UYUWTVRWPYO^O","BbHPDP RJUFX RJKFH R^XZU R^HZK R`P\\P RTTRUPUNTMRMQNNPLRKVKTU","=_RKR[B[BKRK RPKTKXMZQZUXYT[P[LYJUJQLMPK","E_JKZKZ[J[JK RRbRD","C_ESUS RQWUSQO RJWJ[Z[ZKJKJO","@dX[^[ RZO^KZG RF[L[XK^K","E_KOYW RR[RK RYOKW RRMONMPLSMVOXRYUXWVXSWPUNRM","E_JSOSR[USZS RPKTKXMZQZUXYT[P[LYJUJQLMPK","E_R[KOYOR[ RPKTKXMZQZUXYT[P[LYJUJQLMPK","E_STJK RJOJKNK RSKTKXMZQZUXYT[P[LYJUJT","D`KNKROR RYRWPTOPOMPKR RNXMVKUIVHXIZK[MZNX RVXWZY[[Z\\X[VYUWVVX",
            "E_I[N[NKVKV[[[","E_I[V[VK RN[NK[K","E_JKZK RJSRKZSR[JS","E_Z[J[ RZSR[JSRKZS","E_JKZK RJSRKZSR[JS RJSZS","E_Z[J[ RZSR[JSRKZS RJSZS","E_JVLV RJPZP RQVSV RXVZV","BbL[FQLGXG^QX[L[","D`IF[F[aIaIF","MWTFQL","AcZSJS RRORK RR[RW RNOJSNW R^[F[FK^K^[","AcJSZS RRWR[ RRKRO RVWZSVO RFK^K^[F[FK","BbLHQHQC RLSLHQCXCXSLS RLKJKHLGNGXHZJ[Z[\\Z]X]N\\LZKXK","BbROJW RZORW RGXGNHLJKZK\\L]N]X\\ZZ[J[HZGX","H\\XDVGUITLSQR[Rb","H\\RbRD","H\\XbV_U]TZSURKRD","H\\LDNGOIPLQQR[Rb","H\\RbRD","H\\LbN_O]PZQURKRD","H\\XGRGRb","H\\RbRD",
            "H\\X_R_RD","H\\LGRGRb","H\\RbRD","H\\L_R_RD","H\\XDTHSJRNRb","H\\RDRIQMPOLSPWQYR]Rb","H\\XbT^S\\RXRD","H\\RbRD","H\\LDPHQJRNRb","H\\RDRISMTOXSTWSYR]Rb","H\\LbP^Q\\RXRD","H\\RbRD","H\\HS\\S","H\\WDSHRKR[Q^Mb","H\\MDQHRKR[S^Wb","E_VbIF\\F","E_VDI`\\`",">fC^CYaYa^",">fCHCMaMaH",">fC^CYaYa^ RaHaMCMCH","IbMTQSS[bB","H\\RbRD","H\\RbRD","H\\HG\\G","H\\HM\\M","H\\\\YHY","H\\\\_H_","E_UFOFO[","E_U[O[OF","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RRbRD","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RZEJE RRERa","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RJaZa RRaRE",
            "E_RK[[I[RK RRbRD","E_RK[[I[RK RZEJE RRERa","E_RK[[I[RK RJaZa RRaRE","E_JSKRNQQRSTVUYTZS RRbRD","E_JSKRNQQRSTVUYTZS RZEJE RRERa","E_JSKRNQQRSTVUYTZS RJaZa RRaRE","E_JaZa RRaRE","E_ZEJE RRERa","E_OFUFU[","E_O[U[UF","D`TFQL RMKJKJ[Z[ZKWK","E_IWN\\NZZZZKTKTTNTNRIW","E_Z[J[ RJVRKZV","H\\RbRD","H\\NQNROTQUSUUTVRVQ","H\\NQNROTQUSUUTVRVQ RMKWK","H\\NQNROTQUSUUTVRVQ RW[M[","CaGQGRHTJULUNTOROQ RUQURVTXUZU\\T]R]Q RGK]K","CaGQGRHTJULUNTOROQ RUQURVTXUZU\\T]R]Q R][G[","E_JQJRKTMUOUQTRRRQ RRRSTUUWUYTZRZQ","E_JUZUZP","E_JPJUZUZP",
            "E_RPRU RJPJUZUZP","E_HO\\O RLUXU RRFRO RT[P[","E_HS\\S RJMZMZYJYJM",">fB]C\\FZHYKXPWTWYX\\Y^Za\\b]",">fbIaJ^L\\MYNTOPOKNHMFLCJBI",">fB^B]C[EZOZQYRWSYUZ_Za[b]b^",">fbHbIaK_LULSMROQMOLELCKBIBH",">fB^FY^Yb^",">fbH^MFMBH","E_I[NKVK[[I[","AcRE^L^ZRaFZFLRE RQLSLVMXOYRYTXWVYSZQZNYLWKTKRLONMQL","E_JSZS","E_HXMN\\NWXHX","E_JSZS RJSKNLLNKPLQNSXTZV[XZYXZS","E_LMXY RXMLY RPQRPTQUSTURVPUOSPQ","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","E_KKK[ RL[LK RMKM[ RN[NK ROKO[ RP[PK RQKQ[ RR[RK RSKS[ RT[TK RUKU[ RV[VK RWKW[ RX[XK RYKY[ RJKZKZ[J[JK","E_JKZKZ[J[JK","E_KLMKWKYLZNZXYZW[M[KZJXJNKL",
            "E_JKZKZ[J[JK RPPPV RQVQP RRPRV RSVSP RTPTV ROVOPUPUVOV","E_JWZW RJSZS RJOZO RJKZKZ[J[JK","E_NKN[ RRKR[ RVKV[ RJKZKZ[J[JK","E_JWZW RJSZS RJOZO RNKN[ RRKR[ RVKV[ RJKZKZ[J[JK","E_JKZ[ RN[JW RT[JQ RZUPK RZOVK RJKZKZ[J[JK","E_J[ZK RJUTK RJONK RP[ZQ RV[ZW RJKZKZ[J[JK","E_J[ZK RJUTK RJONK RJKZ[ RN[JW RP[ZQ RT[JQ RV[ZW RZUPK RZOVK RJKZKZ[J[JK","E_PPPV RQVQP RRPRV RSVSP RTPTV ROVOPUPUVOV","E_OVOPUPUVOV",
            "E_JXTN RJWSN RJVRN RJUQN RJTPN RJSON RJRNN RJQMN RJPLN RJOKN RKXUN RLXVN RMXWN RNXXN ROXYN RPXZN RQXZO RRXZP RSXZQ RTXZR RUXZS RVXZT RWXZU RXXZV RYXZW RJNZNZXJXJN","E_JNZNZXJXJN","E_M[WQ RMZWP RMYWO RMXWN RMWWM RMVWL RMUWK RMTVK RMSUK RMRTK RMQSK RMPRK RMOQK RMNPK RMMOK RMLNK RN[WR RO[WS RP[WT RQ[WU RR[WV RS[WW RT[WX RU[WY RV[WZ RM[MKWKW[M[","E_M[MKWKW[M[","E_NNLP RONKR RPNJT RQNIV RRNHX RSNIX RTNJX RUNKX RVNLX RWNMX RXVVX RXNNX RYTUX RYNOX RZRTX RZNPX R[PSX R[NQX R\\NRX RHXMN\\NWXHX",
            "E_HXMN\\NWXHX","E_JZJ[ RKXK[ RLVL[ RMTM[ RNSN[ ROQO[ RPOP[ RQMQ[ RRKR[ RSMS[ RTOT[ RUQU[ RVSV[ RWTW[ RXVX[ RYXY[ RZ[RLJ[ RZZZ[ RRK[[I[RK","E_RK[[I[RK","E_OUOV RPSPV RQQQV RRORV RSQSV RTSTV RUUUV ROVRPUV RROVVNVRO","E_ROVVNVRO","E_KKK[ RLLLZ RMLMZ RNMNY ROMOY RPNPX RQNQX RRORW RSPSV RTPTV RUQUU RVQVU RWSXS RWRWT RJKYSJ[ RZSJ\\JJZS","E_ZSJ\\JJZS","E_PPPV RQQQU RRQRU RSSUS RSRST ROPUSOV RVSOWOOVS","E_VSOWOOVS","E_KNKX RLNLX RMOMW RNONW ROOOW RPPPV RQPQV RRPRV RSQSU RTQTU RURUT RVRVT RWRWT RXSWS RJNYSJX RZSJYJMZS",
            "E_ZSJYJMZS","E_ZLZK RYNYK RXPXK RWRWK RVSVK RUUUK RTWTK RSYSK RR[RK RQYQK RPWPK ROUOK RNSNK RMRMK RLPLK RKNKK RJKRZZK RJLJK RR[IK[KR[","E_R[IK[KR[","E_UQUP RTSTP RSUSP RRWRP RQUQP RPSPP ROQOP RUPRVOP RRWNPVPRW","E_RWNPVPRW","E_Y[YK RXZXL RWZWL RVYVM RUYUM RTXTN RSXSN RRWRO RQVQP RPVPP ROUOQ RNUNQ RMSLS RMTMR RZ[KSZK RJSZJZ\\JS","E_JSZJZ\\JS","E_TVTP RSUSQ RRURQ RQSOS RQTQR RUVOSUP RNSUOUWNS","E_NSUOUWNS","E_YXYN RXXXN RWWWO RVWVO RUWUO RTVTP RSVSP RRVRP RQUQQ RPUPQ ROTOR RNTNR RMTMR RLSMS RZXKSZN RJSZMZYJS",
            "E_JSZMZYJS","E_JRJT RKUKQ RLPLV RMWMO RNNNX ROYOM RPLPZ RQ[QK RRJR\\ RS[SK RTLTZ RUYUM RVNVX RWWWO RXPXV RYUYQ RZRZT RRJ[SR\\ISRJ","E_RJ[SR\\ISRJ","E_RJ[SR\\ISRJ RPRPT RQUQQ RRPRV RSUSQ RTRTT RRPUSRVOSRP","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RPQPU RQUQQ RRPRV RSUSQ RTQTU RPTRVTT RPRRPTR RPQRPTQUSTURVPUOSPQ","E_RaJSRFZSRa","E_PKTKXMZQZUXYT[P[LYJUJQLMPK","E_JQKO RKWJU RNLPK RP[NZ RTKVL RVZT[ RYOZQ RZUYW","E_NLNZ RRKR[ RVLVZ RPKTKXMZQZUXYT[P[LYJUJQLMPK","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RPQRPTQUSTURVPUOSPQ",
            "E_KOKW RLXP[ RLNPK RLMLY RMYMM RNLNZ ROZOL RPKP[ RQ[QK RRKR[ RS[SK RT[XX RTKT[ RTKXN RUZUL RVLVZ RWYWM RXMXY RYWYO RPKTKXMZQZUXYT[P[LYJUJQLMPK","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RKOKW RLYLM RMMMY RNZNL ROLOZ RP[LX RP[PK RLN RQKQ[ RR[P[LYJUJQLMPKRKR[","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RYWYO RXMXY RWYWM RVLVZ RUZUL RTKXN RTKT[ RXX RS[SK RRKTKXMZQZUXYT[R[RK","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RKOKS RLMLS RMSMM RNLNS ROSOL RPKLN RPKPS RQKQS RRKRS RSKSS RTSTK RXN RULUS RVSVL RWMWS RXMXS RYOYS RJSJQLMPKTKXMZQZSJS",
            "E_PKTKXMZQZUXYT[P[LYJUJQLMPK RYWYS RXYXS RWSWY RVZVS RUSUZ RT[XX RT[TS RS[SS RR[RS RQ[QS RPSP[ RLX ROZOS RNSNZ RMYMS RLYLS RKWKS RZSZUXYT[P[LYJUJSZS","E_SSSK RTKTS RTKXN RUSUL RVLVS RWSWM RXMXS RYSYO RZSRSRK RPKTKXMZQZUXYT[P[LYJUJQLMPK","E_QSQ[ RP[PS RP[LX ROSOZ RNZNS RMSMY RLYLS RKSKW RJSRSR[ RT[P[LYJUJQLMPKTKXMZQZUXYT[ RYWYO RXMXY RWYWM RVLVZ RUZUL RTKXN RTKT[ RXX RS[SK RRKTKXMZQZUXYT[R[RK","E_KOKW RLYLM RMMMY RNZNL ROLOZ RP[LX RP[PK RLN RQKQ[ RR[P[LYJUJQLMPKRKR[",
            "E_YWYO RXMXY RWYWM RVLVZ RUZUL RTKXN RTKT[ RXX RS[SK RRKTKXMZQZUXYT[R[RK","E_FDFb RGbGD RHDHb RIbID RJDJb RKbKD RLbLW RLDLO RMXMb RMNMD RNbNY RNDNM ROZOb ROLOD RPbPZ RPDPL RQZQb RQLQD RRbRZ RRDRL RSZSb RSLSD RTbTZ RTDTL RUZUb RULUD RVbVY RVDVM RWXWb RWNWD RXbXW RXDXO RYbYD RZDZb R[b[D R\\D\\b R]b]D R^D^b R_bEbED_D_b RKTKRLONMQLSLVMXOYRYTXWVYSZQZNYLWKT",
            "E_FRFD RGNIJ RGDGN RHLHD RIDIK RJJJD RJJMG RKDKI RLHLD RMHQF RMDMH RNGND ROPOS RODOG RPSPP RPGPD RQPQS RQDQG RRSRO RRGRD RSPSS RSFWH RSDSG RTSTP RTGTD RUPUS RUDUG RVGVD RWGZJ RWDWH RXHXD RYDYI RZJZD R[J]N R[D[K R\\L\\D R]D]N R^R^D ROQROUQ RNSOPROUPVSNS RFSFRGNIKJJMHQGSGWHZJ[K]N^R^S_S_DEDESFS R^T^b R]X[\\ R]b]X R\\Z\\b R[b[[ RZ\\Zb RZ\\W_ RYbY] RX^Xb RW^S` RWbW^ RV_Vb RUVUS RUbU_ RTSTV RT_Tb RSVSS RSbS_ RRSRW RR_Rb RQVQS RQ`M^ RQbQ_ RPSPV RP_Pb ROVOS RObO_ RN_Nb RM_J\\ RMbM^ RL^Lb RKbK] RJ\\Jb RI\\GX RIbI[ RHZHb RGbGX RFTFb RUURWOU RVSUVRWOVNSVS R^S^T]X[[Z\\W^S_Q_M^J\\I[GXFTFSESEb_b_S^S",
            "E_FRFD RGNIJ RGDGN RHLHD RIDIK RJJJD RJJMG RKDKI RLHLD RMHQF RMDMH RNGND ROPOS RODOG RPSPP RPGPD RQPQS RQDQG RRSRO RRGRD RSPSS RSFWH RSDSG RTSTP RTGTD RUPUS RUDUG RVGVD RWGZJ RWDWH RXHXD RYDYI RZJZD R[J]N R[D[K R\\L\\D R]D]N R^R^D ROQROUQ RNSOPROUPVSNS RFSFRGNIKJJMHQGSGWHZJ[K]N^R^S_S_DEDESFS","E_^T^b R]X[\\ R]b]X R\\Z\\b R[b[[ RZ\\Zb RZ\\W_ RYbY] RX^Xb RW^S` RWbW^ RV_Vb RUVUS RUbU_ RTSTV RT_Tb RSVSS RSbS_ RRSRW RR_Rb RQVQS RQ`M^ RQbQ_ RPSPV RP_Pb ROVOS RObO_ RN_Nb RM_J\\ RMbM^ RL^Lb RKbK] RJ\\Jb RI\\GX RIbI[ RHZHb RGbGX RFTFb RUURWOU RVSUVRWOVNSVS R^S^T]X[[Z\\W^S_Q_M^J\\I[GXFTFSESEb_b_S^S",
            "E_JSJQLMPKRK","E_ZSZQXMTKRK","E_ZSZUXYT[R[","E_JSJULYP[R[","E_JSJQLMPKTKXMZQZS","E_ZSZUXYT[P[LYJUJS","E_KZK[ RLYL[ RMXM[ RNWN[ ROVO[ RPUP[ RQTQ[ RRSR[ RSRS[ RTQT[ RUPU[ RVOV[ RWNW[ RXMX[ RYLY[ RZ[ZKJ[Z[","E_YZY[ RXYX[ RWXW[ RVWV[ RUVU[ RTUT[ RSTS[ RRSR[ RQRQ[ RPQP[ ROPO[ RNON[ RMNM[ RLML[ RKLK[ RJ[JKZ[J[","E_YLYK RXMXK RWNWK RVOVK RUPUK RTQTK RSRSK RRSRK RQTQK RPUPK ROVOK RNWNK RMXMK RLYLK RKZKK RJKJ[ZKJK","E_KLKK RLMLK RMNMK RNONK ROPOK RPQPK RQRQK RRSRK RSTSK RTUTK RUVUK RVWVK RWXWK RXYXK RYZYK RZKZ[JKZK",
            "E_PQRPTQUSTURVPUOSPQ","E_JKZKZ[J[JK RK[KK RLKL[ RM[MK RNKN[ RO[OK RPKP[ RQ[QK RJ[JKRKR[J[","E_JKZKZ[J[JK RYKY[ RX[XK RWKW[ RV[VK RUKU[ RT[TK RSKS[ RZKZ[R[RKZK","E_JKZKZ[J[JK RYLYK RXMXK RWNWK RVOVK RUPUK RTQTK RSRSK RRSRK RQTQK RPUPK ROVOK RNWNK RMXMK RLYLK RKZKK RJKJ[ZKJK","E_JKZKZ[J[JK RKZK[ RLYL[ RMXM[ RNWN[ ROVO[ RPUP[ RQTQ[ RRSR[ RSRS[ RTQT[ RUPU[ RVOV[ RWNW[ RXMX[ RYLY[ RZ[ZKJ[Z[","E_JKZKZ[J[JK RR[RK","E_RK[[I[RK RRUQVRWSVRURW","E_J[RL RJZJ[ RKXK[ RLVL[ RMTM[ RNSN[ ROQO[ RPOP[ RQMQ[ RRKR[ RRK[[I[RK",
            "E_Z[RL RZZZ[ RYXY[ RXVX[ RWTW[ RVSV[ RUQU[ RTOT[ RSMS[ RRKR[ RRKI[[[RK","C`OFTFXHZJ\\N\\SZWXYT[O[KYIWGSGNIJKHOF","E_JKZKZ[J[JK RRKRSJS","E_JKZKZ[J[JK RR[RSJS","E_JKZKZ[J[JK RR[RSZS","E_JKZKZ[J[JK RRKRSZS","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RRKRSJS","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RR[RSJS","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RR[RSZS","E_PKTKXMZQZUXYT[P[LYJUJQLMPK RRKRSZS","E_JKJ[ZKJK","E_ZKZ[JKZK","E_J[JKZ[J[","E_JKZKZ[J[JK","E_KKK[ RL[LK RMKM[ RN[NK ROKO[ RP[PK RQKQ[ RR[RK RSKS[ RT[TK RUKU[ RV[VK RWKW[ RX[XK RYKY[ RJKZKZ[J[JK","E_OVOPUPUVOV",
            "E_PPPV RQVQP RRPRV RSVSP RTPTV ROVOPUPUVOV","E_Z[ZKJ[Z[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[",
            "F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K[","F^K[KFYFY[K["];
    return NEWSTROKE_FONT;
};


/// AD10.js
/// 
// function Normalize(coord) {
//     return Math.round(0.0254 * coord / 100) / 100;
// }

// function RoundNum(num) {
//     return Math.round(num * 100) / 100;
// }

Number.prototype.round = function anonymFun_round(n) {
    var n = n || 2;
    if (n == 2 || n < 0) {
        return Math.round(this * 100) / 100;
    }
    var d = Math.pow(10, n);
    return Math.round(this * d) / d;
};


function rotatePoint(cPoint, rPoint, angle) {
    var rad = Degrees2Radians(angle);
    return [
        ((rPoint[0] - cPoint[0]) * Math.cos(rad) - (rPoint[1] - cPoint[1]) * Math.sin(rad) + cPoint[0]).round(), 
        -((rPoint[0] - cPoint[0]) * Math.sin(rad) + (rPoint[1] - cPoint[1]) * Math.cos(rad) + cPoint[1]).round()
    ];
}


function get_bbox(Prim) {

    function get_component_bbox(Component) {
        var bbox = {};
        var x0, y0, x1, y1;
        x0 = CoordToMMs(Component.BoundingRectangleNoNameCommentForSignals.Left);
        y0 = CoordToMMs(Component.BoundingRectangleNoNameCommentForSignals.Bottom);
        x1 = CoordToMMs(Component.BoundingRectangleNoNameCommentForSignals.Right);
        y1 = CoordToMMs(Component.BoundingRectangleNoNameCommentForSignals.Top);
        bbox["pos"] = [x0.round(), -y1.round()]; // 
        bbox["relpos"] = [0, 0];
        bbox["angle"] = 0;
        bbox["size"] = [(x1 - x0).round(), (y1 - y0).round()];
        bbox["center"] = [(x0 + bbox.size[0] / 2).round(), -(y0 + bbox.size[1] / 2).round()];
        return bbox;
    }

    function get_text_bbox(Text) {
        var bbox = {};
        var x0, y0, x1, y1;
        x0 = CoordToMMs(Text.BoundingRectangleForSelection.Left);
        y0 = CoordToMMs(Text.BoundingRectangleForSelection.Bottom);
        x1 = CoordToMMs(Text.BoundingRectangleForSelection.Right);
        y1 = CoordToMMs(Text.BoundingRectangleForSelection.Top);
        
        // bbox["pos"] = [x0, -y1];
        // bbox["relpos"] = [0, 0];
        // bbox["angle"] = 0;
        bbox["size"] = [(x1 - x0).round(), (y1 - y0).round()];

        bbox["center"] = [(x0 + bbox.size[0] / 2).round(), -(y0 + bbox.size[1] / 2).round()];

        return bbox;
    }

    switch (Prim.ObjectId) {
        case eComponentObject:
            return get_component_bbox(Prim);
            break;
        case eTextObject:
            return get_text_bbox(Prim);
            break;

        default:
    }
}

/// 
function parsePcb(non) {
    //"use strict";
    var pcb = {}; 
    pcb["pcbdata"] = {};
    pcb["tracks"] = [];
    pcb["texts"] = [];
    pcb["pads"] = [];
    pcb["vias"] = [];
    pcb["arcs"] = [];
    pcb["modules"] = [];
    pcb["fills"] = [];
    pcb["regions"] = [];
    pcb["polygons"] = [];

    pcb["pos"] = [];

    pcb["Layers"] = {};
    pcb.Layers.OUTLINE_LAYER = String2Layer("Keep Out Layer");
    // pcb.Layers.OUTLINE_LAYER = eMechanical1;
    
    pcb.Layers.INFO_LAYER = eMechanical2;
    pcb.Layers.TOP_DIMENSIONS_LAYER = eMechanical11;
    pcb.Layers.BOT_DIMENSIONS_LAYER = eMechanical12;
    pcb.Layers.TOP_MECH_BODY_LAYER = eMechanical13;
    pcb.Layers.BOT_MECH_BODY_LAYER = eMechanical14;
    pcb.Layers.TOP_COURTYARD_LAYER = eMechanical15;
    pcb.Layers.BOT_COURTYARD_LAYER = eMechanical16;
    pcb.Layers.UNUSED_LAYERS = MkSet(eMechanical3, eMechanical4, eMechanical5, eMechanical6, eMechanical7, eMechanical8, eMechanical9, eMechanical10);
    pcb.Layers.TOP_OVERLAY_LAYER = String2Layer("Top Overlay");
    pcb.Layers.BOT_OVERLAY_LAYER = String2Layer("Bottom Overlay");
    pcb.Layers.TOP_SOLDERMASK_LAYER = String2Layer("Top Solder Mask");
    pcb.Layers.BOT_SOLDERMASK_LAYER = String2Layer("Bottom Solder Mask");
    pcb.Layers.TOP_PASTE_LAYER = String2Layer("Top Paste");
    pcb.Layers.BOT_PASTE_LAYER = String2Layer("Bottom Paste");
    pcb.Layers.DRILL_GUIDE_LAYER = String2Layer("Drill Guide");
    pcb.Layers.DRILL_DRAWING_LAYER = String2Layer("Drill Drawing");
    pcb.Layers.KEEP_OUT_LAYER = String2Layer("Keep Out Layer");
    pcb.Layers.MULTI_LAYER = String2Layer("Multi Layer");

    function parseTrack(Prim) {
        var res = {};
        var start = [CoordToMMs(Prim.x1).round(), -CoordToMMs(Prim.y1).round()];
        var end = [CoordToMMs(Prim.x2).round(), -CoordToMMs(Prim.y2).round()];
        res["layer"] = Prim.Layer;
        if (Prim.InPolygon) {
            res["type"] = "polygon";
            res["svgpath"] = ["M", start, "L", end].join(" ");
        } else {
            res["type"] = "segment";
            res["start"] = start;
            res["end"] = end;
            res["width"] = CoordToMMs(Prim.Width).round();
        } 

        if (Prim.InNet) {
            // res["net"] = Prim.Net.Name;
        };

        return res;
    }

    function parseArc(Prim) {
        var res = {};
        var width = CoordToMMs(Prim.LineWidth).round();
        function arc2path(cx, cy, radius, startangle, endangle) {
            var startrad = Degrees2Radians(startangle);
            var endrad = Degrees2Radians(endangle);
            var start = [cx + (radius * Math.cos(startrad)), cy + (radius * Math.sin(startrad))];
            var end = [cx + (radius * Math.cos(endrad)), cy + (radius * Math.sin(endrad))];

            if (start[0] == end[0] && start[1] == end[1]) {
                var d = ["M", cx - radius, -cy, "a", radius, radius, 0, 1, 0, 2*radius, 0, "a", radius, radius, 0, 1, 0, -2*radius, 0].join(" ");
                return d;
            }

            var da = startangle > endangle ? endangle - startangle + 360 : endangle - startangle;
            var largeArcFlag = da <= 180 ? "0" : "1";
            var sweepFlag = 0;
            var d = ["M", start[0].round(), -start[1].round(), "A", radius, radius, 0, largeArcFlag, sweepFlag, end[0].round(), -end[1].round()].join(" ");

            return d;            
        }

        function arc2tracks(cx, cy, radius, startangle, endangle) {
            var da = startangle > endangle ? endangle - startangle + 360 : endangle - startangle;
            var n;
            if (da <= 90 && da >= 0) {
                n = 4;
            } else if (da <= 180 && da > 90) {
                n = 8;
            } else if (da <= 270 && da > 180) {
                n = 16;
            } else if (da <= 360 && da > 270) {
                n = 32;
            }

            var o = [cx + radius, cy];
            // var start = rotatePoint([cx, cy], o, startangle);

            var points = [];
            var step = da / n;
            for (var i = 0; i <= n; i++) {
                points.push(rotatePoint([cx, cy], o, startangle + i * step));
            }

            var tracks = [];
            var len = points.length - 1;
            if (Prim.InPolygon) {
                for (var i = 0; i < len; i++) {
                    tracks.push({
                        "type": "polygon",
                        // "svgpath": ["M", points[i+0][0], -points[i+0][1], points[i+1][0], -points[i+1][1]].join(" "),
                        "svgpath": ["M", points[i+0], points[i+1]].join(" "),
                        "layer": Prim.Layer
                    })
                }   
            } else {
                for (var i = 0; i < len; i++) {
                    tracks.push({
                        "type": "segment",
                        // "start": [points[i+0][0], -points[i+0][1]],
                        // "end": [points[i+1][0], -points[i+1][1]],
                        "start": points[i+0],
                        "end": points[i+1],
                        "layer": Prim.Layer,
                        "width": width
                    })
                }     
            }

            return tracks;
        }

        // if (Prim.IsFreePrimitive && (Prim.Layer == eTopLayer || Prim.Layer == eBottomLayer)) {
        if (Prim.Layer == eTopLayer || Prim.Layer == eBottomLayer) {
            return arc2tracks(CoordToMMs(Prim.XCenter), CoordToMMs(Prim.YCenter), CoordToMMs(Prim.Radius), Prim.StartAngle, Prim.EndAngle);     
        } else {
            res["type"] = "arc";
            res["width"] = width;
            res["startangle"] = -Prim.EndAngle.round();
            res["endangle"] = -Prim.StartAngle.round();
            res["start"] = [CoordToMMs(Prim.XCenter).round(), -CoordToMMs(Prim.YCenter).round()];
            res["radius"] = CoordToMMs(Prim.Radius).round();
            res["layer"] = Prim.Layer;
            return res;
        }
    }

    // 90% done
    function parsePad(Prim) {
        var pads = [];
        var res = {};
        var layers = [];

        if (Prim.Layer == eTopLayer) {
            layers.push("F");
            res["type"] = "smd";
            res["size"] = [CoordToMMs(Prim.TopXSize).round(), CoordToMMs(Prim.TopYSize).round()];
        }
        else if (Prim.Layer == eBottomLayer) {
            layers.push("B");
            res["type"] = "smd";
            res["size"] = [CoordToMMs(Prim.BotXSize).round(), CoordToMMs(Prim.BotYSize).round()];
        }
        else {
            layers.splice(0, 0, "F", "B");
            res["type"] = "th";
            res["size"] = [CoordToMMs(Prim.TopXSize).round(), CoordToMMs(Prim.TopYSize).round()];  
        }

        res["layers"] = layers;
        res["pos"] = [CoordToMMs(Prim.x).round(), -CoordToMMs(Prim.y).round()]; 
        res["angle"] = -Prim.Rotation.round();
        
        // not done 
        if (Prim.Layer == eMultiLayer) {
            switch (Prim.TopShape) {
                case 1:  //  Round in AD
                    res["shape"] = (res["size"][0] == res["size"][1]) ? "circle" : "oval";  // done
                    break;
                case 2:  //  Rectangular in AD
                    res["shape"] = "rect";  // done
                    break;
                case 3:  // Octagonal in AD
                    res["shape"] = "chamfrect";  // not done,  it is circle for now  
                    break;
                case 9:  // Rounded Rectangle in AD
                    res["shape"] = "roundrect";  // 
                    break;
                default:
                    res["shape"] = "custom";  // not done, is it necessary?
            }

            switch (Prim.BotShape) {
                case 1: 
                    res["shape"] = (res["size"][0] == res["size"][1]) ? "circle" : "oval"; 
                    break;
                case 2:
                    res["shape"] = "rect";
                    break;
                case 3:
                    res["shape"] = "chamfrect"; 
                    break;
                case 9:
                    res["shape"] = "roundrect";
                    break;
                default:
                    res["shape"] = "custom";
            }    
        } 
        else {
            switch (Prim.ShapeOnLayer(Prim.Layer)) {
                case 1: 
                    res["shape"] = (res["size"][0] == res["size"][1]) ? "circle" : "oval"; 
                    break;
                case 2:
                    res["shape"] = "rect";
                    break;
                case 3:
                    res["shape"] = "chamfrect";  
                    break;
                case 9:
                    res["shape"] = "roundrect";
                    break;
                default:
                    res["shape"] = "custom";
            }           
        }   

        if (res["shape"] == "chamfrect") {  // not done
            res["radius"] = (Math.min(res["size"][0], res["size"][1]) * 0.5).round();
            res["chamfpos"] = res["pos"];
            res["chamfratio"] = 0.5;  

        } else if (res["shape"] == "roundrect") {
            res["radius"] = CoordToMMs(Prim.CornerRadius(Prim.Layer)).round();  //  smd ? th ?
        }

        if ("A1".indexOf(Prim.Name) != -1) {
            res["pin1"] = 1;
        }

        if (res["type"] == "th") {
            switch (Prim.HoleType) {
                case 0: // circle
                    res["drillsize"] = [CoordToMMs(Prim.HoleSize).round(), CoordToMMs(Prim.HoleSize).round()];
                    res["drillshape"] = "circle";
                    break;
                case 1: // square, but not supported in kicad, so do as circle
                    res["drillsize"] = [CoordToMMs(Prim.HoleSize).round(), CoordToMMs(Prim.HoleSize).round()];
                    res["drillshape"] = "circle";
                    break;
                case 2: // slot
                    res["drillsize"] = [CoordToMMs(Prim.HoleWidth).round(), CoordToMMs(Prim.HoleSize).round()];
                    res["drillshape"] = "oblong"; 
                    break;
                default:  //
            }
        }

        res["offset"] =  [CoordToMMs(Prim.XPadOffset(Prim.Layer)).round(), -CoordToMMs(Prim.YPadOffset(Prim.Layer)).round()];
        if (res["offset"][0] == 0 && res["offset"][1] == 0) {
            delete res["offset"];
        }

        pads.push(res);

        return pads;
    }

    // 75% done
    function parseVia(Prim) {
        var vias = [];
        var res = {};
        var layers = [];

        var viaLayer; 
        if (Prim.StartLayer.LayerID == eTopLayer && Prim.StopLayer.LayerID != eBottomLayer) {
            viaLayer = eTopLayer;
            layers.push("F");
            res["type"] = "smd";
            res["size"] = [CoordToMMs(Prim.StackSizeOnLayer(eTopLayer)).round(), CoordToMMs(Prim.StackSizeOnLayer(eTopLayer)).round()];
        } 
        else if (Prim.StartLayer.LayerID != eBottomLayer && Prim.StopLayer.LayerID == eTopLayer) {
            viaLayer = eTopLayer;
            layers.push("F");
            res["type"] = "smd";
            res["size"] = [CoordToMMs(Prim.StackSizeOnLayer(eTopLayer)).round(), CoordToMMs(Prim.StackSizeOnLayer(eTopLayer)).round()];
        } 
        else if (Prim.StartLayer.LayerID == eTopLayer && Prim.StopLayer.LayerID == eTopLayer) {
            viaLayer = eTopLayer;
            layers.push("F");
            res["type"] = "smd";
            res["size"] = [CoordToMMs(Prim.StackSizeOnLayer(eTopLayer)).round(), CoordToMMs(Prim.StackSizeOnLayer(eTopLayer)).round()];
        } 
        else if (Prim.StartLayer.LayerID == eBottomLayer && Prim.StopLayer.LayerID != eTopLayer) {
            viaLayer = eBottomLayer;
            layers.push("B");
            res["type"] = "smd";
            res["size"] = [CoordToMMs(Prim.StackSizeOnLayer(eBottomLayer)).round(), CoordToMMs(Prim.StackSizeOnLayer(eBottomLayer)).round()];
        } 
        else if (Prim.StartLayer.LayerID != eTopLayer && Prim.StopLayer.LayerID == eBottomLayer) {
            viaLayer = eBottomLayer;
            layers.push("B");
            res["type"] = "smd";
            res["size"] = [CoordToMMs(Prim.StackSizeOnLayer(eBottomLayer)).round(), CoordToMMs(Prim.StackSizeOnLayer(eBottomLayer)).round()];
        } 
        else if (Prim.StartLayer.LayerID == eBottomLayer && Prim.StopLayer.LayerID == eBottomLayer) {
            viaLayer = eBottomLayer;
            layers.push("B");
            res["type"] = "smd";
            res["size"] = [CoordToMMs(Prim.StackSizeOnLayer(eBottomLayer)).round(), CoordToMMs(Prim.StackSizeOnLayer(eBottomLayer)).round()];
        } 
        else if (Prim.StartLayer.LayerID == eTopLayer && Prim.StopLayer.LayerID == eBottomLayer) {
            viaLayer = eMultiLayer;
            layers.splice(0, 0, "F", "B");
            res["type"] = "th";
            res["size"] = [CoordToMMs(Prim.Size).round(), CoordToMMs(Prim.Size).round()];  
        } 
        else if (Prim.StartLayer.LayerID == eBottomLayer && Prim.StopLayer.LayerID == eTopLayer) {
            viaLayer = eMultiLayer;
            layers.splice(0, 0, "F", "B");
            res["type"] = "th";
            res["size"] = [CoordToMMs(Prim.Size).round(), CoordToMMs(Prim.Size).round()];  
        } else {
            viaLayer = "inner";
        }

        res["layers"] = layers;
        res["pos"] = [CoordToMMs(Prim.x).round(), -CoordToMMs(Prim.y).round()];
        res["angle"] = 0; 
        
        res["shape"] = "circle";

        if (res["type"] == "th") {
            res["drillsize"] = [CoordToMMs(Prim.HoleSize).round(), CoordToMMs(Prim.HoleSize).round()];
            res["drillshape"] = "circle";
        }

        if (Prim.InNet) {
            // res["net"] = Prim.Net.Name;
        }
        vias.push(res);

        return vias;
    }

    // 99% done
    function parseFill(Prim) {
        var res = {};

        if (Prim.IsKeepout) {
            return res;
        }
        var angle = Prim.Rotation;
        var corner1 = [CoordToMMs(Prim.X1Location), CoordToMMs(Prim.Y1Location)];
        var corner3 = [CoordToMMs(Prim.X2Location), CoordToMMs(Prim.Y2Location)];
        var width = corner3[0] - corner1[0];
        var height = corner3[1] - corner1[1];
        var pos = [corner1[0] + width / 2, corner1[1] + height / 2];
        var corner2 = [corner1[0], corner3[1]];
        var corner4 = [corner3[0], corner1[1]];
        var tcorner1 = rotatePoint(pos, corner1, angle);
        var tcorner2 = rotatePoint(pos, corner2, angle);
        var tcorner3 = rotatePoint(pos, corner3, angle);
        var tcorner4 = rotatePoint(pos, corner4, angle);

        // res["svgpath"] =  ["M", tcorner1[0], -tcorner1[1], "L", tcorner2[0], -tcorner2[1], "L", tcorner3[0], -tcorner3[1], "L", tcorner4[0], -tcorner4[1], "Z"].join(" ");
        res["svgpath"] =  ["M", tcorner1, "L", tcorner2, "L", tcorner3, "L", tcorner4, "Z"].join(" ");
        res["type"] = "polygon";
        res["layer"] = Prim.Layer;
       
       if (Prim.InNet) {
        // res.net = ""; 
       } else {}

        // if (!Prim.IsFreePrimitive) {
        //     res['free'] = false;
        // }
        return res;
    }

    // 55% done
    function parseRegion(Prim) {
        var res = {};
        var polygons = [];
        var count = Prim.MainContour.Count;
        var holes_svg = [];
        if (Prim.Kind == 0 && !Prim.IsKeepout) {    // Kind "Board Cutout" not done (Tracks on KeepOutLayer can do it).
            for (var i = 1; i <= count; i++) {
                polygons.push([CoordToMMs(Prim.MainContour.x(i)).round(), -CoordToMMs(Prim.MainContour.y(i)).round()].join(" "));
            }      
            
            count = Prim.HoleCount;
            for (var k = 0; k < count; k++) {
                var hole = [];
                for (var i = 1; i <= Prim.Holes(k).Count; i++) {
                    hole.push([CoordToMMs(Prim.Holes(k).x(i)).round(), -CoordToMMs(Prim.Holes(k).y(i)).round()].join(" "));
                }
                holes_svg.push(["M", hole.shift(), "L", hole.join("L"), "Z "].join(""));
            }
        } else {
            return res;
        }

        res["type"] = "polygon";
        res["svgpath"] = ["M", polygons.shift(), "L", polygons.join("L"), "Z "].join("") + holes_svg.join(""); 
        res["layer"] = Prim.Layer;
        if (Prim.InNet) {
            // res["net"] = Prim.Net.Name;
        } else {}

        return res;
    }

    // 50% done
    function parsePoly(Polygon) {
        var drawings = [];
        // var count = Polygon.PointCount; 
        // for (var i = 0; i <= count; i++) {
        //     if (Polygon.Segments(i).Kind == ePolySegmentArc) {
        //         polygons.push({"x": CoordToMMs(Polygon.Segments(i).cx), "y": CoordToMMs(-Polygon.Segments(i).cy)});
        //     }
        //     else {
        //         polygons.push({"x": CoordToMMs(Polygon.Segments(i).vx), "y": CoordToMMs(-Polygon.Segments(i).vy)});
        //     }           
        // }   
        var hatched_drawings = [];

        var Iter = Polygon.GroupIterator_Create;
        var Prim = Iter.FirstPCBObject;
        while (Prim != null) {
            switch (Prim.ObjectId) {
                case eArcObject:
                    hatched_drawings = hatched_drawings.concat(parseArc(Prim));
                    break;
                case eTrackObject:
                    hatched_drawings.push(parseTrack(Prim));
                    break;
                case eRegionObject:
                    drawings.push(parseRegion(Prim));
                    break;
            }
            Prim = Iter.NextPCBObject;
        }

        var len = hatched_drawings.length;
        if (len > 1) {
            var hatchedAll2One = {};
            var pathArr = [];
            for (var i = 0; i < len; i++) {
                pathArr.push(hatched_drawings[i].svgpath);
            }
            hatchedAll2One["width"] = CoordToMMs(Polygon.TrackSize).round();
            hatchedAll2One["type"] = "polygon"
            hatchedAll2One["svgpath"] = pathArr.join(" ");
            hatchedAll2One["layer"] = hatched_drawings[0].layer;
            drawings.push(hatchedAll2One);
        }
        return drawings;
    }

    // 95% done
    function parseEdges(pcb) {
        var edges = [];
        var default_width = CoordToMMs(MilsToCoord(5)).round();
        var bbox = {};
        bbox["minx"] = CoordToMMs(pcb.board.BoardOutline.BoundingRectangle.Left).round();
        bbox["miny"] = -CoordToMMs(pcb.board.BoardOutline.BoundingRectangle.Top).round();
        bbox["maxx"] = CoordToMMs(pcb.board.BoardOutline.BoundingRectangle.Right).round();
        bbox["maxy"] = -CoordToMMs(pcb.board.BoardOutline.BoundingRectangle.Bottom).round();
    
        // boardoutline edges 
        // var k;
        // var count = pcb.board.BoardOutline.PointCount
        // for (var i = 0; i < count; i++) {
        //     k = i + 1;
        //     edges.push({});
        //     if (pcb.board.BoardOutline.Segments(i).Kind == ePolySegmentLine) {
        //         if (k == pcb.board.BoardOutline.PointCount) {
        //             k = 0;
        //         }
        //         edges[i]["start"] = [CoordToMMs(pcb.board.BoardOutline.Segments(i).vx).round(), -CoordToMMs(pcb.board.BoardOutline.Segments(i).vy).round()];
        //         edges[i]["end"] = [CoordToMMs(pcb.board.BoardOutline.Segments(k).vx).round(), -CoordToMMs(pcb.board.BoardOutline.Segments(k).vy).round()];
        //         edges[i]["type"] = "segment";
        //         edges[i]["width"] = default_width;
        //         edges[i]["layer"] = pcb.Layers.OUTLINE_LAYER;
        //     }
        //     else {
        //         edges[i]["start"] = [CoordToMMs(pcb.board.BoardOutline.Segments(i).cx).round(), -CoordToMMs(pcb.board.BoardOutline.Segments(i).cy).round()];
        //         edges[i]["startangle"] = -pcb.board.BoardOutline.Segments(i).Angle2;
        //         edges[i]["endangle"] = -pcb.board.BoardOutline.Segments(i).Angle1;
        //         edges[i]["type"] = "arc";
        //         edges[i]["radius"] = CoordToMMs(pcb.board.BoardOutline.Segments(i).Radius).round();
        //         edges[i]["width"] = default_width;
        //         edges[i]["layer"] = pcb.Layers.OUTLINE_LAYER;
        //     }
        // }

        var Iter, Prim;
        Iter = pcb.board.BoardIterator_Create;
        Iter.AddFilter_ObjectSet(MkSet(eArcObject, eTrackObject));
        Iter.AddFilter_LayerSet(MkSet(pcb.Layers.OUTLINE_LAYER));
        Iter.AddFilter_Method(eProcessAll);
        Prim = Iter.FirstPCBObject;
        while (Prim != null) {
            switch (Prim.ObjectId) {
                case eArcObject:
                    edges.push(parseArc(Prim));
                    break;
                case eTrackObject:
                    edges.push(parseTrack(Prim));
                    break;
            }
            Prim = Iter.NextPCBObject;
        }
        pcb.board.BoardIterator_Destroy(Iter);

        pcb.pcbdata["edges"] = edges;
        pcb.pcbdata["edges_bbox"] = bbox;
    }

    function getMetadata(pcb) {
        var res = {};
        res["title"] = ChangeFileExt(pcb.boardname, "");
        res["revision"] = "";
        res["company"] = "";

        var fso = new ActiveXObject("Scripting.FileSystemObject"); 
        var boardfile = fso.GetFile(pcb.board.FileName);
        var d = new Date(boardfile.DateLastModified);
        
        res["date"] = [d.getFullYear() , d.getMonth() + 1, d.getDate()].join("-") + " " + [d.getHours(), d.getMinutes(), d.getSeconds()].join(":");
        return res;
    }

    // 90% done  // use the KiCad's font , not support chinese char.
    function parseText(Prim) {
        var res = {};
        if (Prim.IsHidden) {
            return res;
        }
        else if (Prim.TextKind == eText_BarCode) {
            return res;  //  an API in AD called ConvetToStrokeArray, how to use it?
        }

        var len = Prim.Text.length;
        if (len == 0) {
            return res;
        }

        res["attr"] = [];
        if (Prim.MirrorFlag) {
            res.attr.push("mirrored");
        }
        if (Prim.Italic) {
            res.attr.push("italic");
        }
        if (Prim.Bold) {
            res.attr.push("bold");
        }
        if (Prim.Inverted) {
            res.attr.push("inverted");
        }
        res["type"] = "text";
        res["text"] = Prim.Text;
        res["angle"] = Prim.Rotation.round();
        res["layer"] = Prim.Layer;

        var bbox = get_bbox(Prim);
        res["pos"] = bbox["center"];

        if (Prim.TextKind == 0) {
            res["thickness"] = CoordToMMs(Prim.Width).round();
            res["height"] = CoordToMMs(Prim.Size).round();
            res["width"] = res["height"].round(); // single char's width in kicad
        } else if (Prim.TextKind == 1) {
            res["height"] = CoordToMMs(Prim.TTFTextHeight * 0.6).round();
            res["width"] = CoordToMMs(Prim.TTFTextWidth * 0.9 / len).round();
            res["thickness"] = CoordToMMs(res["height"] * 0.1).round();
        }

        // res["horiz_justify"] = 0; // center align, tag 2.3
        res["justify"] = [0, 0];  //

        if (Prim.IsDesignator) {
            res["ref"] = 1;
        }
        if (Prim.IsComment) {
            res["val"] = 1;
        }

        return res;
    }


    // 91% done
    function parseComponent(Component) {
        var res = {};
        var oFootprint = {};
        var oComponent = {};
        var pads = [];

        var Iter, Prim;
        var isSMD = true;
        Iter = Component.GroupIterator_Create;
        Iter.AddFilter_ObjectSet(MkSet(ePadObject));
        Iter.AddFilter_LayerSet(AllLayers);
        Prim = Iter.FirstPCBObject;
        while (Prim != null) {
            pads = pads.concat(parsePad(Prim));
            if (isSMD && Prim.Layer == eMultiLayer) {
                isSMD = false;
            }
            Prim = Iter.NextPCBObject;
        }
        Component.GroupIterator_Destroy(Iter);

        oFootprint["drawings"] = [];
        Iter = Component.GroupIterator_Create;
        Iter.AddFilter_ObjectSet(MkSet(eTrackObject, eArcObject, eFillobject, eRegionObject));
        Iter.AddFilter_LayerSet(MkSet(eTopLayer, eBottomLayer));
        Prim = Iter.FirstPCBObject;
        while (Prim != null) {
            if (Prim.Layer == eTopLayer) {
                switch (Prim.ObjectId) {
                    case eTrackObject:
                        oFootprint["drawings"].push({"layer": "F", "drawing": parseTrack(Prim)});
                        break;
                    case eArcObject:
                        oFootprint["drawings"].push({"layer": "F", "drawing": parseArc(Prim)});
                        break;
                    case eFillobject:
                        oFootprint["drawings"].push({"layer": "F", "drawing": parseFill(Prim)});
                        break;
                    case eRegionObject:
                        oFootprint["drawings"].push({"layer": "F", "drawing": parseRegion(Prim)});
                        break;
                    default:
                }
            } 
            else if (Prim.Layer == eBottomLayer) {
                switch (Prim.ObjectId) {
                    case eTrackObject:
                        oFootprint["drawings"].push({"layer": "B", "drawing": parseTrack(Prim)});
                        break;
                    case eArcObject:
                        oFootprint["drawings"].push({"layer": "B", "drawing": parseArc(Prim)});
                        break;
                    case eFillobject:
                        oFootprint["drawings"].push({"layer": "B", "drawing": parseFill(Prim)});
                        break;
                    case eRegionObject:
                        oFootprint["drawings"].push({"layer": "B", "drawing": parseRegion(Prim)});
                        break;
                    default:
                }
            }
            Prim = Iter.NextPCBObject;
        }
        Component.GroupIterator_Destroy(Iter);

        var bbox = get_bbox(Component);
        oFootprint["center"] = bbox.center;
        delete bbox.center;
        oFootprint["bbox"] = bbox;
        oFootprint["pads"] = pads;
        oFootprint["ref"] = Component.Name.Text;
        if (Component.Layer == eTopLayer) {
            oFootprint["layer"] = "F";
        }
        else {
            oFootprint["layer"] = "B";
        }

        res["footprint"] = oFootprint;

        oComponent["ref"] = oFootprint.ref;
        oComponent["val"] = Component.Comment.Text;
        oComponent["footprint"] = Component.Pattern;
        oComponent["layer"] = oFootprint["layer"];
        oComponent["attr"] = null;

        res["angle"] = Component.Rotation.round();
        res["itemkey"] = ["k", oComponent["ref"].slice(0, 1), oComponent["footprint"], oComponent["val"]].join("");
        
        if (isSMD) {
            res["soldertype"] = "smd";
        }
        else {
            res["soldertype"] = "th";
        }

        res["component"] = oComponent;

        return res;
    }

    //======
    function parseDrawingsOnLayers(drawings, f_layer, b_layer) {
        var front = [];
        var back = [];
        for (var i = drawings.length - 1; i >= 0; i--) {
            if (drawings[i].layer == f_layer) {
                front.push(drawings[i]);
            }
            else if (drawings[i].layer == b_layer) {
                back.push(drawings[i]);
            }
        }
        return {"F": front, "B": back};
    }

    // parse_board
    if (PCBServer == null) {
        showmessage("Please open a PCB document");
        return false;
    }
    PCBServer.PreProcess;
    var board = PCBServer.GetCurrentPCBBoard();
    if (board == null) {
        showmessage("ERROR:Current document is not a PCB document");
        return false;
    }
    pcb["board"] = board;
    pcb["boardpath"] = ExtractFilePath(board.FileName);
    pcb["boardname"] = ExtractFileName(board.FileName);

    pcb.pcbdata["metadata"] = getMetadata(pcb);

    parseEdges(pcb);

    pcb.pos.push(CoordToMMs(board.XOrigin).round());
    pcb.pos.push(CoordToMMs(board.YOrigin).round());

    var Iter, Prim; 
    Iter = pcb.board.BoardIterator_Create;
    Iter.AddFilter_ObjectSet(MkSet(eComponentObject));
    Iter.AddFilter_LayerSet(AllLayers);
    Iter.AddFilter_Method(eProcessAll);
    Prim = Iter.FirstPCBObject;
    while (Prim != null) {
        pcb.modules.push(parseComponent(Prim));
        Prim = Iter.NextPCBObject;
    }
    pcb.board.BoardIterator_Destroy(Iter);

    // parse freepads , all free pads mounted to a footprintNoBom to be rendered
    var footprintNoBom = {};
    footprintNoBom["bbox"] = {"pos": [0, 0], "relpos": [0, 0], "size": [0, 0], "angle": 0};
    footprintNoBom["center"] = [0, 0];
    footprintNoBom["ref"] = "";
    footprintNoBom["layer"] = "F";
    footprintNoBom["drawings"] = [];
    footprintNoBom["pads"] = [];

    Iter = pcb.board.BoardIterator_Create; 
    Iter.AddFilter_ObjectSet(MkSet(ePadObject, eViaObject));
    Iter.AddFilter_LayerSet(AllLayers);
    Iter.AddFilter_Method(eProcessAll);
    Prim = Iter.FirstPCBObject;
    while (Prim != null) {
        if (Prim.IsFreePrimitive) {
            switch (Prim.ObjectId) {
                case ePadObject:
                    footprintNoBom.pads = footprintNoBom.pads.concat(parsePad(Prim));
                    break;
                case eViaObject:
                    if (config.include.vias) {
                        footprintNoBom.pads = footprintNoBom.pads.concat(parseVia(Prim));
                    }
                    break;
                default:
            }
        }
        Prim = Iter.NextPCBObject;
    }
    pcb.board.BoardIterator_Destroy(Iter);

    pcb.modules = sortModules(pcb.modules);

    var kk = pcb.modules.length;
    pcb.pcbdata["footprints"] = [];
    for (var n = 0; n < kk; n++) {
        pcb.pcbdata["footprints"].push(pcb.modules[n].footprint);
    }
    pcb.pcbdata.footprints.push(footprintNoBom);

    // parse_drawings
    var drawings = [];
    Iter = pcb.board.BoardIterator_Create;
    Iter.AddFilter_ObjectSet(MkSet(eTextObject, eTrackObject, eArcObject, eFillobject, eRegionObject));
    Iter.AddFilter_LayerSet(MkSet(pcb.Layers.TOP_OVERLAY_LAYER, pcb.Layers.BOT_OVERLAY_LAYER));
    Iter.AddFilter_Method(eProcessAll);
    Prim = Iter.FirstPCBObject;
    while (Prim != null) {
        switch (Prim.ObjectId) {
            case eTextObject:
                pcb.texts.push(parseText(Prim));
                break;
            case eTrackObject:
                pcb.tracks.push(parseTrack(Prim));
                break;
            case eArcObject:
                pcb.arcs.push(parseArc(Prim));
                break;
            case eFillobject:
                pcb.fills.push(parseFill(Prim));
                break;
            case eRegionObject:
                pcb.regions.push(parseRegion(Prim));
                break;                  
            default:
        }
        Prim = Iter.NextPCBObject;
    }
    pcb.board.BoardIterator_Destroy(Iter);

    drawings = drawings.concat(pcb.texts, pcb.tracks, pcb.arcs, pcb.fills, pcb.regions);
    pcb.pcbdata["silkscreen"] = parseDrawingsOnLayers(drawings, pcb.Layers.TOP_OVERLAY_LAYER, pcb.Layers.BOT_OVERLAY_LAYER);
    // pcb.pcbdata["fabrication"] = parseDrawingsOnLayers(drawings, pcb.Layers.TOP_DIMENSIONS_LAYER, pcb.Layers.BOT_DIMENSIONS_LAYER);
    pcb.pcbdata["fabrication"] = {
        "F": [],
        "B": []
    };
    
    // rough handling tracks and zones, not done
    Iter = pcb.board.BoardIterator_Create;

    if (config.include.tracks && !config.include.polys) {
        Iter.AddFilter_ObjectSet(MkSet(eTrackObject, eArcObject));
    } else if (config.include.polys && !config.include.tracks) {
        Iter.AddFilter_ObjectSet(MkSet(eFillobject, eRegionObject, ePolyObject));
    } else if (config.include.polys && config.include.tracks) {
        Iter.AddFilter_ObjectSet(MkSet(eFillobject, eRegionObject, ePolyObject, eArcObject, eTrackObject));
    } else {
        Iter.AddFilter_ObjectSet(MkSet());
    }

    Iter.AddFilter_LayerSet(MkSet(eTopLayer, eBottomLayer));
    Iter.AddFilter_Method(eProcessAll);
    var draws = {};
    draws["tracks"] = [];
    draws["polygons"] = [];
    draws["arcs"] = [];
    Prim = Iter.FirstPCBObject;
    while (Prim != null) {
        if (Prim.InComponent || Prim.InPolygon) {
            Prim = Iter.NextPCBObject;
            continue; 
        }

        switch (Prim.ObjectId) {
            case eTrackObject:
                draws.tracks.push(parseTrack(Prim));
                break;
            case eArcObject:
                if (Prim.IsFreePrimitive) {
                    draws.tracks = draws.tracks.concat(parseArc(Prim));
                } else {
                    // draws.arcs.push(parseArc(Prim));
                }
                break;
            case eFillobject:
                draws.polygons.push(parseFill(Prim));
                break;
            case eRegionObject:
                draws.polygons.push(parseRegion(Prim));
                break;    
            case ePolyObject:
                if ((Prim.PolyHatchStyle != ePolySolid) && (!config.include.polyHatched)) {
                    break; 
                }
                draws.polygons = draws.polygons.concat(parsePoly(Prim));
                break;                   
            default:
        }    
        Prim = Iter.NextPCBObject;
    }
    pcb.board.BoardIterator_Destroy(Iter);

    if (config.include.tracks || config.include.polys) {
        pcb.pcbdata["tracks"] = parseDrawingsOnLayers(draws.tracks, eTopLayer, eBottomLayer);  
        pcb.pcbdata["zones"] = parseDrawingsOnLayers(draws.polygons, eTopLayer, eBottomLayer);  
    }

    function parseFontStr(s) {
        pcb.pcbdata["font_data"] = {};
        var STROKE_FONT_SCALE = 1 / 21;
        var FONT_OFFSET = -10;
        var NEWSTROKE_FONT = get_newstroke_font();
        function parseFontChar(c) {
            var lines = [];
            var glyph_x = 0;
            var glyph_width;
            var line = [];
            var index = c.charCodeAt(0) - " ".charCodeAt(0);
            if (index >= NEWSTROKE_FONT.length) {
                index = "?".charCodeAt(0) - " ".charCodeAt(0);
            }

            var glyph_str = NEWSTROKE_FONT[index];
            var coord;
            var len = glyph_str.length;
            for (var i = 0; i < len; i += 2) {
                coord = glyph_str.slice(i, i + 2);
                if (i < 2) {
                    glyph_x = (coord.charCodeAt(0) - "R".charCodeAt(0)) * STROKE_FONT_SCALE;
                    glyph_width = (coord.charCodeAt(1) - coord.charCodeAt(0)) * STROKE_FONT_SCALE;
                } else if (coord.slice(0, 1) == " " && coord.slice(1, 2) == "R") {
                    lines.push(line);
                    line = [];
                }
                else {
                    line.push([
                        ((coord.charCodeAt(0) - "R".charCodeAt(0)) * STROKE_FONT_SCALE - glyph_x).round(),
                        ((coord.charCodeAt(1) - "R".charCodeAt(0) + FONT_OFFSET) * STROKE_FONT_SCALE).round()
                        ])
                }
            }

            if (line.length > 0) {
                lines.push(line);
            }
            return {
                "w": glyph_width.round(),
                "l": lines
            }
        }

        var chrArr = s.split("");
        for (var i = chrArr.length - 1; i >= 0; i--) {
            if (chrArr[i] == "\t" && !pcb.pcbdata.font_data.hasOwnProperty(chrArr[i])) {
                pcb.pcbdata.font_data[" "] = parseFontChar(" ");
            } 
            
            if (!pcb.pcbdata.font_data.hasOwnProperty(chrArr[i]) && chrArr[i].charCodeAt(0) >= " ".charCodeAt(0)) {
                pcb.pcbdata.font_data[chrArr[i]] = parseFontChar(chrArr[i]);
            } 
        }
    }

    var str_text = [];
    for (var i = pcb.texts.length - 1; i >= 0; i--) {
        str_text.push(pcb.texts[i].text);
    }
    parseFontStr(str_text.join(""));

    PCBServer.PostProcess;

    return pcb;
} 
// var t0 = new Date().getTime();
// var pcb = parsePcb();
/// ibom.js
///
 
/*
module = {
    "angle": xx,
    "itemkey": xx,
    "soldertype": xx,
    "footprint": {xx..}
    "comment": {xx..}
}
*/
function skipComponent(m, config, extra_data) {
    config = config || {};
    config.skiplist = [];
    config.skipempty = true;
    config.skiponepad = true;
    config.skipvirtual = true;
    extra_data = extra_data || {};
    var re = /^[A-Z]*/g;
    var ref_prefix = re.exec(m["component"].ref);
    if (m["component"].ref in config.skiplist) {
        return true;
    }
    if (ref_prefix + "*" in config.skiplist) {
        return true;
    } 
    // skip component with empty comment
    if (config.skipempty && m["component"].val in {"DNP": 1, "": 2, "~": 3}) {
        return true;
    }
    // skip virtual components
    if (config.skipvirtual && m["component"].attr == "virtual") {
        return true;
    }
    // skip components with one pad
    if (config.skiponepad && m["footprint"].pads.length <= 1) {
        return true;
    }
    // skip components with dnp field not empty
    if (config.dnpfield && extra_data[m["component"].ref][config.dnpfield]) {
        return true;
    }
    // skip th components
    if (config.skipth && m.soldertype == "th") {
        return true;
    }
    // skip components on layer, "F" or "B"
    if (config.skiplayer == m["component"].layer) {
        return true;
    }
}


function sortModules(modules) {
    function mergeModules (iBegin, iMid, iEnd) {
        var tmp = [];
        var j = iBegin;
        var n = iMid;
        var k = iMid + 1;
        while (j <= n && k <= iEnd) {

            // sort: smd > th
            if (modules[j].soldertype != modules[k].soldertype) {
                if (modules[j].soldertype == "smd") {
                    tmp.push(modules[j]);
                    j++;
                    continue;
                }
                if (modules[k].soldertype == "smd") {
                    tmp.push(modules[k]);
                    k++;
                    continue;
                }
            }

            // sort by itemkey
            if (modules[j].itemkey > modules[k].itemkey) {   ///  <
                tmp.push(modules[j]);
                j++;
            } else if (modules[j].itemkey == modules[k].itemkey) {
                if (modules[j]["component"].ref.length < modules[k]["component"].ref.length) {
                    tmp.push(modules[j]);
                    j++;
                } else if (modules[j]["component"].ref.length == modules[k]["component"].ref.length && modules[j]["component"].ref < modules[k]["component"].ref) {
                    tmp.push(modules[j]);
                    j++;
                } else {
                    tmp.push(modules[k]);
                    k++;
                }
            } else {
                tmp.push(modules[k]);
                k++;
            }
        }   

        while (j <= n) {
            tmp.push(modules[j]);
            j++;
        }   

        while (k <= iEnd) {
            tmp.push(modules[k]);
            k++;
        }   

        k = tmp.length;
        for (var i = 0; i < k; i++) {
            if (modules[iBegin + i]["component"].ref != tmp[i]["component"].ref) {
                modules[iBegin + i] = tmp[i];
            }
        }       
    }

    var len = modules.length;
    var dt = 1;
    while (dt < len) {
        var i = 0;
        while (i < len - dt) {
            if (i + 2 * dt < len) {
                mergeModules(i, i + dt - 1, i + 2 * dt - 1);
            } else {
                mergeModules(i, i + dt - 1, len - 1);
            }
            i = i + 2 * dt;
        }
        dt = 2 * dt;
    }
    return modules;
};


function generateBom(pcb, config, extra_data) {
    // type (list, dict, dict) -> dict
    // return: dict of BOM tables (qty, value, footprint, refs) and dnp components
    var extra_data = arguments[2] ? arguments[2] : {}; 

    var res = {};
    var extras = [];
    var modules = pcb.modules;
    var rows = {};  // { itemkey: [quantity, comment, footprint, designator, extras] }
    var rowsB = {};
    var rowsF = {};
    var skippedComponents = [];
    var count = modules.length;
    for (var i = 0; i < count; i++) {
        if (skipComponent(modules[i])) {
            skippedComponents.push(i);
            continue;
        }
    
        //   extra_data =
        //    {
        //       ref1: {
        //         field_name1: field_value1,
        //         field_name2: field_value2,
        //         ...
        //         },
        //       ref2: ...
        //    }
        if (!rows.hasOwnProperty(modules[i].itemkey)) {

            if (extra_data.hasOwnProperty(modules[i]["component"].ref)) {
                for (var field_name in extra_data[modules[i]["component"].ref]) {
                    extras.push(extra_data[modules[i]["component"].ref][field_name]);  // extras = [field_value1, field_value2 ...]    
                }   
            } else {
                for (var k = config["htmlConfig"].extra_fields.length - 1; k >= 0; k--) {
                    extras.push("");
                }
            }     

            rows[modules[i].itemkey] = [1, modules[i]["component"].val, modules[i]["component"].footprint, [[modules[i]["component"].ref, i]], extras];
            extras = [];
        } else {
            rows[modules[i].itemkey][0]++;
            rows[modules[i].itemkey][3].push([modules[i]["component"].ref, i]);
        }

        if (modules[i]["component"].layer == "F") {
            if (!rowsF.hasOwnProperty(modules[i].itemkey)) {
                rowsF[modules[i].itemkey] = [1, modules[i]["component"].val, modules[i]["component"].footprint, [[modules[i]["component"].ref, i]] ];
            } else {
                rowsF[modules[i].itemkey][0]++;
                rowsF[modules[i].itemkey][3].push([modules[i]["component"].ref, i]);    
            }
        } else {
            if (!rowsB.hasOwnProperty(modules[i].itemkey)) {
                rowsB[modules[i].itemkey] = [1, modules[i]["component"].val, modules[i]["component"].footprint, [[modules[i]["component"].ref, i]] ];
            } else {
                rowsB[modules[i].itemkey][0]++;
                rowsB[modules[i].itemkey][3].push([modules[i]["component"].ref, i]);    
            }
        }
    }

    res.both = []
    for (var i in rows) {
        res.both.push(rows[i]);
    }

    res.F = []
    for (var i in rowsF) {
        rowsF[i].push(rows[i][4]); // add extras
        res.F.push(rowsF[i]);
    }

    res.B = []
    for (var i in rowsB) {
        rowsB[i].push(rows[i][4]); 
        res.B.push(rowsB[i]);
    }
    
    res.skipped = skippedComponents;
    return res;
}


function save2file(src, filename, noBOM) {
    var noBOM = arguments[2] ? arguments[2] : false; 
    var fso = new ActiveXObject("Scripting.FileSystemObject"); 
    var filename = filename.replace("/", "\\");
    var arrFolder = filename.split("\\");
    var len = arrFolder.length - 1;
    var folder = "";
    if (arrFolder[len] == "") {
        showmessage("path error");
        return;
    }
    for (var i = 0; i < len; i++) {
        if (arrFolder[i] == "") {
            showmessage("path error");
            return;
        }
        folder = folder + arrFolder[i];
        if (!fso.FolderExists(folder)) {
            fso.CreateFolder(folder);
        }
        folder = folder + "\\"; 
    }
    // var folder = ExtractFilePath(filename);
    // if (!fso.FolderExists(folder)) {
    //     fso.CreateFolder(folder);
    // } 

    if (fso.FileExists(filename)) {
        try {
            fso.DeleteFile(filename, true);
        }
        catch (e) {
            showmessage(e.message);
        }
    }

    var stm = new ActiveXObject("Adodb.Stream");
    stm.Type = 2;
    stm.Mode = 3;
    stm.Open();
    stm.Charset = "utf-8";
    
    stm.Position = stm.Size;
    stm.WriteText(src);
    
    if (noBOM) {
        // remove the BOM head
        stm.Position = 3;
        var newstm = new ActiveXObject("Adodb.Stream");
        newstm.Mode = 3;
        newstm.Type = 1;
        newstm.Open();
        stm.CopyTo(newstm);
        newstm.SaveToFile(filename, 2);      
        newstm.flush();
        newstm.Close();
    } else {
        stm.SaveToFile(filename, 2);      
        stm.flush();
        stm.Close();     
    }
}

function loadfile(filename) {
    var stm = new ActiveXObject("Adodb.Stream");
    stm.Type = 2;
    stm.Mode = 3;
    stm.Open();
    stm.Charset = "utf-8";
    stm.Position = stm.Size;

    var fso = new ActiveXObject("Scripting.FileSystemObject"); 
    if (!fso.FileExists(filename)) {
        s = "";
    }
    else {
        stm.LoadFromFile(filename);
        var s = stm.ReadText();    
    }
    stm.flush();
    stm.Close();
    return s;
}


function generateFile(compressed_pcbdata, config_js) {
    var filepath = CURRENT_PATH + "web\\";

    var html = loadfile(filepath + "ibom.html");
    html = html.replace("///CSS///", loadfile(filepath + "ibom.css"));
    html = html.replace("///SPLITJS///", loadfile(filepath + "split.js"));
    html = html.replace("///LZ-STRING///", loadfile(filepath + "lz-string.js"));
    html = html.replace("///POINTER_EVENTS_POLYFILL///", loadfile(filepath + "pep.js"));
    html = html.replace("///CONFIG///", config_js);
    html = html.replace("///PCBDATA///", compressed_pcbdata);
    html = html.replace("///UTILJS///", loadfile(filepath + "util.js"));
    html = html.replace("///RENDERJS///", loadfile(filepath + "render.js"));
    html = html.replace("///IBOMJS///", loadfile(filepath + "ibom.js"));

    html = html.replace("///USERCSS///", loadfile(filepath + "user.css"));
    html = html.replace("///USERJS///", loadfile(filepath + "user.js"));
    html = html.replace("///USERHEADER///", loadfile(filepath + "userheader.html"));
    html = html.replace("///USERFOOTER///", loadfile(filepath + "userfooter.html"));
   
    return html;
}


function loadExtraData(filename) {
    var s = loadfile(filename);
    if (s == "") {
        return {};
    }
    var d = JSON.parse(s);
    //d = {"123": "C1,C2", "332": "R1"}

    //    {
    //       ref1: {
    //         field_name1: field_value1,
    //         field_name2: field_value2,
    //         ...
    //         },
    //       ref2: ...
    //    }
    var extra_data = {};
    for (var key in d) {
        var ref = d[key].split(",")[0];
        extra_data[ref] = {};
        extra_data[ref]["Num."] = key;
    }
    return extra_data;
}


function main() {
    var pcb = parsePcb();
    if (!pcb) {
        return;
    };
    
    var filename = pcb.boardpath + "PnPout\\" + "extra_data.txt";
    // var extra_data = loadExtraData(filename);
    var extra_data;

    pcb.pcbdata["bom"] = generateBom(pcb, config, extra_data);
    pcb.pcbdata["ibom_version"] = "v2.3";

    // var t1 = new Date().getTime();

    var s = JSON.stringify(pcb.pcbdata);
    // var t2 = new Date().getTime();
    var b = LZStr.compressToBase64(s);
    // var t3 = new Date().getTime();
    // showmessage("t1: "+String(t1-t0)+"   t2: "+String(t2-t1)+"   t3: "+String(t3-t2));

    b = 'var pcbdata = JSON.parse(LZString.decompressFromBase64("' + b + '"))';

    var config_js = "var config = " + JSON.stringify(config.htmlConfig);
    var html = generateFile(b, config_js);
    filename = pcb.boardpath + "PnPout\\" + pcb.boardname.split(".")[0] + ".html";
    save2file(html, filename, false);

    try {
        var commandline = "explorer.exe " + ExtractFilePath(filename);
        var errcode = RunApplication(commandline);
    }
    catch(e) {
        showmessage(e.message);
    };
}

/// export
///
function exportJSON() {  // export json of pcb without attr "bom" & "ibom_version"
    var res = {};
    var pcb = parsePcb();
    if (!pcb) {
        return;
    };

    res["components"] = [];
    var kk = pcb.modules.length;
    for (var n = 0; n < kk; n++) {
        res["components"].push(pcb.modules[n].component);
    }

    res["pcbdata"] = pcb.pcbdata;
    // res["pcbdata"]["modules"] = res["pcbdata"]["footprints"]; 
    // delete res["pcbdata"].footprints;
    res["source"] = "AD10";
    var s = JSON.stringify(res);
    var filename = pcb.boardpath + "PnPout\\" + pcb.boardname.split(".")[0] + ".json";
    save2file(s, filename, true);

    try {
        var commandline = "explorer.exe " + ExtractFilePath(filename);
        var errcode = RunApplication(commandline);
    }
    catch(e) {
        showmessage(e.message);
    };
}


function exportBOM() {
    var pcb = parsePcb();
    if (!pcb) {
        return;
    };
    var modules = pcb.modules;
    var count = modules.length ;
    var rows = {};
    var rowsDNP = {};
    for (var i = 0; i < count; i++) {
        if (skipComponent(modules[i])) {
            if (modules[i]["footprint"].pads.length <= 1) {
                continue;
            }

            if (!rowsDNP.hasOwnProperty(modules[i].itemkey)) {
                rowsDNP[modules[i].itemkey] = [modules[i]["component"].val, modules[i].soldertype, modules[i]["component"].footprint, " ", 1, " ", [modules[i]["component"].ref], " ", [], []];
            } else {
                rowsDNP[modules[i].itemkey][4]++;
                rowsDNP[modules[i].itemkey][6].push(modules[i]["component"].ref);
            }

            if (modules[i]["component"].layer == "F") {
                rowsDNP[modules[i].itemkey][8].push(modules[i]["component"].ref);
            } else {
                rowsDNP[modules[i].itemkey][9].push(modules[i]["component"].ref);
            }           
            continue;
        }

        if (!rows.hasOwnProperty(modules[i].itemkey)) {
            rows[modules[i].itemkey] = [modules[i]["component"].val, modules[i].soldertype, modules[i]["component"].footprint, " ", 1, " ", [modules[i]["component"].ref], " ", [], []];
        } else {
            rows[modules[i].itemkey][4]++;
            rows[modules[i].itemkey][6].push(modules[i]["component"].ref);
        }

        if (modules[i]["component"].layer == "F") {
            rows[modules[i].itemkey][8].push(modules[i]["component"].ref);
        } else {
            rows[modules[i].itemkey][9].push(modules[i]["component"].ref);
        }
    }    

    var res = [];
    var filename = pcb.boardpath + "PnPout\\" + pcb.boardname.split(".")[0] + ".txt";
    res.push(["Comment", "Soldertype", "Footprint", " ", "Quantity", " ", "Designator", " ", "TopLayer", "BtmLayer"].join("\t"));
    for (var i in rows) {
        rows[i][6]= rows[i][6].join(",");
        rows[i][8]= rows[i][8].join(",");
        rows[i][9]= rows[i][9].join(",");
        res.push(rows[i].join("\t"));
    }

    for (var i in rowsDNP) {
        rowsDNP[i][6]= rowsDNP[i][6].join(",");
        rowsDNP[i][8]= rowsDNP[i][8].join(",");
        rowsDNP[i][9]= rowsDNP[i][9].join(",");
        res.push(rowsDNP[i].join("\t"));
    }

    save2file(res.join("\n"), filename, false);

    var commandline = "notepad.exe " + filename;
    var errcode = RunApplication(commandline);
}

function exportPnP() {
    var pcb = parsePcb();
    if (!pcb) {
        return;
    };
    var modules = pcb.modules;
    var count = modules.length; 
    var rowsF = {};
    var rowsB = {};
    var rowsDNP = {};
    for (var i = 0; i < count; i++) {
        if (skipComponent(modules[i])) {
            if (modules[i]["footprint"].pads.length <= 1) {
                continue;
            }

            if (!rowsDNP.hasOwnProperty(modules[i].itemkey)) {
                rowsDNP[modules[i].itemkey] = [i];
            } else {
                rowsDNP[modules[i].itemkey].push(i);
            }     
            continue;
        }

        if (modules[i]["component"].layer == "F") {
            if (!rowsF.hasOwnProperty(modules[i].itemkey)) {
                rowsF[modules[i].itemkey] = [i];
            } else {
                rowsF[modules[i].itemkey].push(i);
            }
        } else {
            if (!rowsB.hasOwnProperty(modules[i].itemkey)) {
                rowsB[modules[i].itemkey] = [i];
            } else {
                rowsB[modules[i].itemkey].push(i);
            }
        }
    }    

    var res = [];
    // res.push(["Designator", "Footprint", "Mid X", "Mid Y", "Ref X", "Ref Y", "Pad X", "Pad Y", "Layer", "Rotation", "Comment"].join(","));
    res.push(["Designator", "Footprint", "Mid X", "Mid Y", "Layer", "Rotation", "Comment"].join(","));
    for (var i in rowsF) {
        var lenF = rowsF[i].length;
        for (var k = 0; k < lenF; k++) {
            res.push([modules[rowsF[i][k]]["component"].ref, modules[rowsF[i][k]]["component"].footprint, [(modules[rowsF[i][k]]["footprint"].center[0] - pcb.pos[0]).toFixed(2), "mm"].join("") , [(-modules[rowsF[i][k]]["footprint"].center[1] - pcb.pos[1]).toFixed(2), "mm"].join(""), "T", modules[rowsF[i][k]].angle, modules[rowsF[i][k]]["component"].val].join(","));
        }
    }

    for (var i in rowsB) {
        var lenB = rowsB[i].length;
        for (var k = 0; k < lenB; k++) {
            res.push([modules[rowsB[i][k]]["component"].ref, modules[rowsB[i][k]]["component"].footprint, [(modules[rowsB[i][k]]["footprint"].center[0] - pcb.pos[0]).toFixed(2), "mm"].join("") , [(-modules[rowsB[i][k]]["footprint"].center[1] - pcb.pos[1]).toFixed(2), "mm"].join(""), "B", modules[rowsB[i][k]].angle, modules[rowsB[i][k]]["component"].val].join(","));
        }
    }

    for (var i in rowsDNP) {
        var lenD = rowsDNP[i].length;
        for (var k = 0; k < lenD; k++) {
            res.push([modules[rowsDNP[i][k]]["component"].ref, modules[rowsDNP[i][k]]["component"].footprint, [(modules[rowsDNP[i][k]]["footprint"].center[0] - pcb.pos[0]).toFixed(2), "mm"].join("") , [(-modules[rowsDNP[i][k]]["footprint"].center[1] - pcb.pos[1]).toFixed(2), "mm"].join(""), modules[rowsDNP[i][k]]["component"].layer, modules[rowsDNP[i][k]].angle, modules[rowsDNP[i][k]]["component"].val].join(","));
        }
    }

    var filename = pcb.boardpath + "PnPout\\" + pcb.boardname.split(".")[0] + ".csv";
    save2file(res.join("\n"), filename, false);

    try {
        var commandline = "explorer.exe " + ExtractFilePath(filename);
        var errcode = RunApplication(commandline);
    }
    catch(e) {
        showmessage(e.message);
    };
}
