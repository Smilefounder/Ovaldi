/**
 * Created by Raoh on 2014/11/7.
 */
define([
    "dojo/_base/declare"
], function (declare) {
    return declare([], {
        constructor: function (startLine, startColumn, endLine, endColumn) {
            this.startLine = startLine;
            this.startColumn = startColumn;
            this.endLine = endLine;
            this.endColumn = endColumn;
        }
    });
});
