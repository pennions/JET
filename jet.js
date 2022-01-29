
/** Taken and adapted from https://github.com/olado/doT/blob/master/doT.js */
(function () {
    "use strict";

    var fts = {
        name: "fts",
        version: "0.1.0",
        template: undefined, //fn, compile template
        compile: undefined, //fn, for express
        log: true
    }, _globals;

    fts.encodeHTMLSource = function (doNotSkipEncoded) {
        var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
            matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
        return function (code) {
            return code ? code.toString().replace(matchHTML, function (m) { return encodeHTMLRules[m] || m; }) : "";
        };
    };

    _globals = (function () { return this || (0, eval)("this"); }());

    if (typeof module !== "undefined" && module.exports) {
        module.exports = fts;
    } else if (typeof define === "function" && define.amd) {
        define(function () { return fts; });
    } else {
        _globals.fts = fts;
    }
})();