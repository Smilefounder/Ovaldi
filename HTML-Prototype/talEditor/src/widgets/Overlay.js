/**
 * Created by Raoh on 2014/10/21.
 */
define([
    "dojo/_base/window",
    "dojo/dom-style",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin"
], function (win, domStyle, declare, _WidgetBase, _TemplatedMixin) {
    var Overlay = declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-overlay",
        bgColor: 'rgba(0,0,0,0)',
        templateString: '<div style="position:fixed;display:none;left:0;right:0;top:0;bottom:0;background-color: rgba(0,0,0,0)"></div>',
        postCreate: function () {
            this.inherited(arguments);
            domStyle.set(this.domNode, "background-color", this.bgColor);
        },
        show: function () {
            domStyle.set(this.domNode, "display", "block");
        },
        hide: function () {
            domStyle.set(this.domNode, "display", "none");
        },
        _setBgColorAttr: function (color) {
            if (this.bgColor != color) {
                this._set("bgColor", color);
                domStyle.set(this.domNode, "background-color", color);
            }
        }
    });
    Overlay.show = function () {
        Overlay._instance = Overlay._instance || new Overlay();
        if (!Overlay._instance) {
            var inst = Overlay._instance = new Overlay();
            inst.placeAt(win.body());
            inst.startup();
        }
        Overlay._instance.show();
    };
    Overlay.hide = function () {
        Overlay._instance && Overlay._instance.destroy();
        Overlay._instance = null;
    };
    return Overlay;
});