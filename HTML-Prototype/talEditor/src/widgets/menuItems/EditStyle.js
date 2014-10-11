/**
 * Created by Raoh on 2014/10/11.
 */
define([
    "dojo/_base/declare",
    "./MenuItem",
    "tal/widgets/StyleAccordion"
], function (declare, MenuItem, StyleAccordion) {
    return declare([MenuItem], {
        text: "Edit style",
        dialog: null,
        visibility: function () {
            return true;
        },
        callback: function () {
            this.inherited(arguments);
            var self = this;
            if (!this.dialog) {
                this.dialog = new StyleAccordion();
                this.dialog.placeAt(this.menu.ownerDocument.body);
                this.dialog.startup();
                this.dialog.on("open", function () {
                    this.set("el",self.menu.el);
                });
                this.menu.watch("el", function () {
                    self.dialog.close();
                });
            }
            this.dialog.open();
        }
    });
});
