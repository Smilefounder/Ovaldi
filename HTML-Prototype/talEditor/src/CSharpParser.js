/**
 * Created by Raoh on 2014/8/15.
 */
define([
    "dojo/_base/declare",
    "dojo/string",
    "./_TalParserMixin"
], function (declare, string, _TalParserMixin) {
    return declare([_TalParserMixin], {
        define: function () {

        },
        switch: function () {

        },
        case: function () {

        },
        repeat: function (ds) {
            return {
                attr: string.substitute("${0}:${1}", [this.prefix, "repeat"]),
                val:ds
            };
        },
        content: function () {
            return string.substitute(
                "${0}:${1}",
                [this.prefix,"content"]);
        },
        attributes: function () {

        }
    });
});