/**
 * Created by Raoh on 2014/10/14.
 */
define([

], function () {
    var rdashAlpha = /-([a-z]|[0-9])/ig;

    function fcamelCase(all, letter) {
        return (letter + "").toUpperCase();
    }
    return{
        trimAll: function (str) {
            return (str || '').replace(/\s/g, '');
        },
        camelCase: function (string) {
            return string.replace(rdashAlpha, fcamelCase);
        }
    }
});
