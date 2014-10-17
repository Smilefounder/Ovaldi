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
