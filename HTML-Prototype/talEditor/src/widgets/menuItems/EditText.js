/**
 * Created by Raoh on 2014/10/11.
 */
define([
    "dojo/_base/declare",
    "./MenuItem",
    "dojo/topic"
], function (declare,MenuItem, topic) {
    var ignoreRegExp = /^img|button|input|br$/i;
    return declare([MenuItem], {
        text: "Edit",
        visibility: function () {
            return this.menu.el && !ignoreRegExp.test(this.menu.el.tagName);
        },
        callback: function () {
            this.inherited(arguments);
            topic.publish("inlinemenu/edit", {refEl: this.menu.el});
        }
    });
});
