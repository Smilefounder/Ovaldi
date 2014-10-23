/**
 * Created by Raoh on 2014/10/11.
 */
define([
    "dojo/topic",
    "dojo/on",
    "dojo/_base/window",
    "dojo/_base/declare",
    "dojo/dom-style",
    "./MenuItem",
    "tal/widgets/StyleAccordion",
    "tal/widgets/Overlay",
    "tal/cssUtils",
    "underscore"
], function (topic, on, win, declare, domStyle, MenuItem, StyleAccordion, Overlay, cssUtils, _) {
    return declare([MenuItem], {
        text: "Edit CSS",
        dialog: null,
        el: null,
        overlay: null,
        constructor: function () {
            this._handlers = [];
        },
        visibility: function () {
            return true;
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
            if (!this.dialog) {
                var d = this.dialog = new StyleAccordion();
                d.placeAt(this.menu.ownerDocument.body);
                d.startup();
                d.on("open", function () {
                    self.overlay.show();
                    var cs = domStyle.getComputedStyle(self.el);
                    this.css(cs);
                    self._handlers.push(this.on("change", function (css) {
                        console.log("style", css);
                        var ret = cssUtils.distinct(css, cs);
                        domStyle.set(self.el, ret);
                        //TODO
                        //假设 border-top-style:none;border-top-width:0px;
                        //当用户border-top-style为非none值，这时border-top-width的宽度默认会是3px，
                        //这时如果立即刷新面板会重置值，将导致用户的删除和修改出现焦点跳动，只能延迟刷新
                        /*this.defer(function () {
                         this.css(cs);
                         }, 250);*/
                        if (!_.isEmpty(ret)) {
                            this.defer(function () {
                                //更新CodeViewer
                                topic.publish("dom/modified", {target: self.el});
                            }, 50);
                        }
                    }));
                });
                this.menu.watch("el", function () {
                    d.close();
                });
                d.on("beforeClose", function () {
                    self.clearHandlers();
                    self.el = null;
                });
                d.on("close", function () {
                    self.overlay.hide();
                });
            }
            this.dialog.open();
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
