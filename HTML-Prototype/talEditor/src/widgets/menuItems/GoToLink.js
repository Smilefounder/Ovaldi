/**
 * Created by Raoh on 2014/10/11.
 */
define([
    "dojo/topic",
    "dojo/_base/declare",
    "./MenuItem",
    "tal/string",
], function (topic, declare, MenuItem, string) {
    return declare([MenuItem], {
        text: "Direct to this page",
        visibility: function () {
            return this.menu.el && /^a$/i.test(this.menu.el.tagName) &&
                this.isUrl(this.menu.el.href);
        },
        callback: function () {
            if (this.menu.el.href && window.confirm("Do you want to direct to this link?")) {
                topic.publish("sandbox/redirect", {href: this.menu.el.href});
            }
        },
        isUrl: function (str) {
            return str.startsWith("http://")||str.startsWith("https://")
        }
    });
});