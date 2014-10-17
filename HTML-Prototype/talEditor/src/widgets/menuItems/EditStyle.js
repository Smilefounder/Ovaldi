/**
 * Created by Raoh on 2014/10/11.
 */
define([
    "dojo/_base/declare",
    "dojo/dom-style",
    "./MenuItem",
    "tal/widgets/StyleAccordion",
    "tal/cssUtils"
], function (declare, domStyle, MenuItem, StyleAccordion, cssUtils) {
    return declare([MenuItem], {
        text: "Edit style",
        dialog: null,
        el: null,
        visibility: function () {
            return true;
        },
        callback: function () {
            this.inherited(arguments);
            var self = this;
            self.el = self.menu.el;
            if (!this.dialog) {
                this.dialog = new StyleAccordion();
                this.dialog.placeAt(this.menu.ownerDocument.body);
                this.dialog.startup();
                var handler;
                this.dialog.on("open", function () {
                    var cs = domStyle.getComputedStyle(self.el);
                    this.css(cs);
                    handler = this.on("change", function (css) {
                        var ret = cssUtils.distinct(css, cs);
                        domStyle.set(self.el, ret);
                        //假设 border-top-style:none;border-top-width:0px;
                        //当用户border-top-style为非none值，这时border-top-width的宽度默认会是3px，
                        //这时如果立即刷新面板会重置值，将导致用户的删除和修改出现焦点跳动，只能延迟刷新
                        this.defer(function () {
                            this.css(cs);
                        }, 250);
                    });
                });
                this.menu.watch("el", function () {
                    self.dialog.close();
                });
                this.dialog.on("beforeClose", function () {
                    handler && handler.remove();
                    self.el = null;
                });
                //TODO:更新CodeViewer
            }
            this.dialog.open();
        }
    });
});
