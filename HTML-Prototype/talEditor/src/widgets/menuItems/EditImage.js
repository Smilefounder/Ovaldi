/**
 * Created by Raoh on 2014/10/11.
 */
define([
    "dojo/on",
    "dojo/topic",
    "dojo/_base/window",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "./MenuItem",
    "tal/widgets/ImageDialog",
    "tal/widgets/Overlay"
], function (on, topic, win, declare, lang, MenuItem, ImageDialog, Overlay) {
    var imgRegExp = /^img$/i;
    return declare([MenuItem], {
        text: "Edit image",
        dialog: null,
        el: null,
        overlay: null,
        constructor: function () {
            this._handlers = [];
        },
        visibility: function () {
            var el = this.menu.el;
            return el && imgRegExp.test(el.tagName);
        },
        callback: function () {
            this.inherited(arguments);
            var self = this;
            self.el = self.menu.el;
            if (!this.overlay) {
                var ol = this.overlay = new Overlay();
                ol.placeAt(win.body());
                ol.startup();
                this.own(on(ol.domNode, "click", function () {
                    var d = self.dialog;
                    d && d.isOpen() && d.close();
                }));
            }
            if (!self.dialog) {
                var d = self.dialog = new ImageDialog();
                d.placeAt(self.menu.ownerDocument.body);
                d.startup();
                d.on("open", function () {
                    self.overlay.show();
                    this.value({
                        src: self.el.src,
                        alt: self.el.alt,
                        title: self.el.title
                    });
                    self._handlers.push(this.on("change", function () {
                        var value = this.value();
                        self.el.src = value["src"];
                        self.el.alt = value["alt"];
                        self.el.title = value["title"];
                        topic.publish("dom/modified", {target: self.el});
                    }));
                });
                d.on("beforeClose", function () {
                    self.clearHandlers();
                    self.el = null;
                });
                d.on("close", function () {
                    self.overlay.hide();
                });
                self.menu.watch("el", function () {
                    d.isOpen() && d.close();
                });
                d.callback = function () {
                    $.pop({
                        url: "/Contents/MediaContent/Selection?siteName=Test&UUID=Test&return=%2FSites%2FView%3FsiteName%3DTest&listType=grid&SingleChoice=true",
                        width: 900,
                        height: 500,
                        dialogClass: 'kb-dialog kb-iframe-dialog',
                        frameHeight: '100%',
                        onload: function (handle, pop, config) {
                            window.onFileSelected = function (src, text) {
                                d.src(src);
                            };
                        }
                    });
                };
            }
            self.dialog.open();
        },
        clearHandlers: function () {
            var h;
            while (h = this._handlers.pop()) {
                h.remove();
            }
        },
        destroy: function () {
            this.clearHandlers();
            this.overlay && this.overlay.destroy();
            this.inherited(arguments);
            delete this.overlay;
        }
    });
});
