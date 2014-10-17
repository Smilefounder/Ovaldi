/**
 * Created by Raoh on 2014/10/11.
 */
define([
    "dojo/_base/declare",
    "./MenuItem"
], function (declare, MenuItem) {
    return declare([MenuItem], {
        text: "Direct to this page",
        visibility: function () {
            //TODO:需要判断是否URL
            return this.menu.el && /^a$/i.test(this.menu.el.tagName);
        },
        callback: function () {
            if (this.menu.el.href && window.confirm("Do you want to direct to this link?")) {
                //TODO:通知iframe跳转
                alert("TODO:通知iframe跳转");
            }
        }
    });
});