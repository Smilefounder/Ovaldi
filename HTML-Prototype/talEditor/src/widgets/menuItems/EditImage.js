/**
 * Created by Raoh on 2014/10/11.
 */
define([
    "dojo/on",
    "dojo/topic",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "./MenuItem",
    "tal/widgets/ImageDialog"
], function (on, topic, declare, lang, MenuItem, ImageDialog) {
    var imgRegExp = /^img$/i;
    return declare([MenuItem], {
        text: "Edit image",
        dialog: null,
        el: null,
        visibility: function () {
            return this.menu.el && imgRegExp.test(this.menu.el.tagName);
        },
        callback: function () {
            this.inherited(arguments);
            var self = this;
            self.el = self.menu.el;
            if (!self.dialog) {
                self.dialog = new ImageDialog();
                self.dialog.placeAt(self.menu.ownerDocument.body);
                self.dialog.startup();
                self.dialog.on("open", function () {
                    this.set({
                        src: self.el.src,
                        alt: self.el.alt,
                        title: self.el.title
                    });
                });
                self.dialog.on("change",function(){
                    self.el.src = this.get("src");
                    self.el.alt = this.get("alt");
                    self.el.title = this.get("title");
                });
                self.dialog.on("beforeClose", function () {
                    self.el.src = this.get("src");
                    self.el.alt = this.get("alt");
                    self.el.title = this.get("title");
                });
                self.menu.watch("el", function () {
                    self.dialog.close();
                });
                this.dialog.callback = function () {
                    $.pop({
                        url: "http://192.168.1.231:9999/Contents/MediaContent/Selection?siteName=Test&UUID=Test&return=%2FSites%2FView%3FsiteName%3DTest&listType=grid&SingleChoice=true",
                        width: 900,
                        height: 500,
                        dialogClass: 'iframe-dialog',
                        frameHeight: '100%',
                        onload: function (handle, pop, config) {
                            window.onFileSelected = function (src, text) {
                                self.dialog.set("src", src);
                                self.el.src = src;
                            };
                        }
                    });
                };
            }
            self.dialog.open();
        }
    });
});
