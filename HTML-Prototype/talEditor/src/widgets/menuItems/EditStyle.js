/**
 * Created by Raoh on 2014/10/11.
 */
define([
    "dojo/topic",
    "dojo/_base/declare",
    "dojo/dom-style",
    "./MenuItem",
    "tal/widgets/StyleAccordion",
    "tal/cssUtils",
    "underscore"
], function (topic, declare, domStyle, MenuItem, StyleAccordion, cssUtils, _) {
    return declare([MenuItem], {
        text: "Edit CSS",
        dialog: null,
        el: null,
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
            if (!this.dialog) {
                this.dialog = new StyleAccordion();
                this.dialog.placeAt(this.menu.ownerDocument.body);
                this.dialog.startup();
                var handler;
                this.dialog.on("open", function () {
                    topic.publish("overlay/show");
                    var cs = domStyle.getComputedStyle(self.el);
                    this.css(cs);
                    handler = this.on("change", function (css) {
                        console.log("style",css);
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
                    });
                });
                this._handlers.push(topic.subscribe("overlay/click", function () {
                    if (self.dialog.isOpen()) {
                        self.dialog.close();
                    }
                }));
                this.menu.watch("el", function () {
                    self.dialog.close();
                });
                this.dialog.on("beforeClose", function () {
                    handler && handler.remove();
                    self.el = null;
                });
                this.dialog.on("close", function () {
                    topic.publish("overlay/hide");
                })
            }
            this.dialog.open();
        },
        destroy: function () {
            var h;
            while (h = this._handlers.pop()) {
                h.remove();
            }
            this.inherited(arguments);
        }
    });
});
