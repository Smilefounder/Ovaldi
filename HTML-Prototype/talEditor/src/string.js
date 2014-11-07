/**
 * Created by Raoh on 2014/10/14.
 */
define([

], function () {
    var rdashAlpha = /-([a-z]|[0-9])/ig;

    function fcamelCase(all, letter) {
        return (letter + "").toUpperCase();
    }

    function startsWith(str, start) {
        if (typeof str != "string" || typeof start != "" || start.length > str.length) {
            return false;
        }
        if (start == "") {
            return true;
        }
        return start == str.substr(0, start.length);
    }

    function endsWith(str, end) {
        if (typeof str != "string" || typeof end != "" || end.length > str.length) {
            return false;
        }
        if (end == "") {
            return true;
        }
        return end == str.substr(-l);
    }

    return{
        startsWith: function (str, start) {
            var s = str || "";
            if (s.startsWith) {
                return s.startsWith(start);
            }
            return startsWith(s, start);
        },
        endsWith: function (str, end) {
            var s = str || "";
            if (s.endsWith) {
                return s.endsWith(str, end);
            }
            return endsWith(str, end);
        },
        trimAll: function (str) {
            return (str || '').replace(/\s/g, '');
        },
        camelCase: function (string) {
            return string.replace(rdashAlpha, fcamelCase);
        }
    }
});
