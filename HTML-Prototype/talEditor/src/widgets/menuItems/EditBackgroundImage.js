/**
 * Created by Raoh on 2014/10/11.
 */
define([
    "dojo/topic",
    "dojo/_base/declare",
    "dojo/dom-style",
    "tal/widgets/BackgroundImageDialog",
    "./MenuItem"
], function (topic, declare, domStyle, BackgroundImageDialog, MenuItem) {
    return declare([MenuItem], {
        text: "Edit background image",
        dialog: null,
        el: null,
        visibility: function () {
            //TODO:有背景图片才显示
            return true;
        },
        callback: function () {
            this.inherited(arguments);
            var self = this;
            self.el = self.menu.el;
            if (!self.dialog) {
                self.dialog = new BackgroundImageDialog();
                self.dialog.placeAt(self.menu.ownerDocument.body);
                self.dialog.startup();
                var handler;
                self.dialog.on("open", function () {
                    var cs = domStyle.getComputedStyle(self.el);
                    this.css(cs);
                    handler = this.on("change", function (css) {
                        domStyle.set(self.el, css);
                        topic.publish("dom/modified", {target: self.el});
                    });
                });
                self.dialog.on("beforeClose", function () {
                    handler && handler.remove();
                    self.el = null;
                });
                self.menu.watch("el", function () {
                    self.dialog.close();
                });
                self.dialog.callback = function () {
                    $.pop({
                        url: "http://192.168.1.231:9998/Contents/MediaContent/Selection?siteName=Test&UUID=Test&return=%2FSites%2FView%3FsiteName%3DTest&listType=grid&SingleChoice=true",
                        width: 900,
                        height: 500,
                        dialogClass: 'iframe-dialog',
                        frameHeight: '100%',
                        onload: function (handle, pop, config) {
                            window.onFileSelected = function (src, text) {
                                self.dialog.src(src);
                            };
                        }
                    });
                };
            }
            self.dialog.open();
        }
    });
});
