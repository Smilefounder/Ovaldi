/**
 * Created by Raoh on 2014/9/30.
 */
define([
    "dojo/on",
    "dojo/query",
    "dojo/_base/declare",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-attr",
    "dojo/dom-prop",
    "dojo/_base/lang",
    "dojo/_base/Color",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/BorderPanel.html",
    "./UnitSpinner",
    "./ColorBox"
], function (on, query, declare, domClass, domStyle, domAttr, domProp, lang, Color, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        baseClass: "kb-border-panel",
        templateString: template,
        labelWidth: "Width",
        labelStyle: "Style",
        labelColor: "Color",

        widthSpinner: null,
        styleNode: null,
        colorBox: null,

        noteNode: null,
        lockNode: null,

        lock: false,
        edge: "Top",
        __fireChange: false,//控制是否触发onChange事件
        startup: function () {
            this.inherited(arguments);
            var handler = lang.hitch(this, function () {
                if (this.__fireChange) {
                    this._onChange();
                }
            });
            this.own([
                this.widthSpinner.on("change", handler),
                on(this.styleNode, "change", handler),
                this.colorBox.on("change", handler),
                on(this.domNode, "[data-edge]:click", lang.hitch(this, function (e) {
                    if (!this.lock) {
                        this.set("edge", domAttr.get(e.target, "data-edge"));
                    }
                }))
            ]);
            this.set("lock", this.lock);
        },
        css: function (css) {
            if (css) {
                this.cs = css;
                this._edit();
            } else {
                var ret = {},
                    width = this.widthSpinner.get("value"),
                    style = this.styleNode.value,
                    rgba = this.colorBox.get("value");
                var arr = [this.edge];
                if (!this.edge) {
                    arr = ["Top", "Right", "Bottom", "Left"];
                }
                for (var i = 0, j = arr.length; i < j; i++) {
                    ret["border" + arr[i] + "Width"] = width;
                    ret["border" + arr[i] + "Style"] = style;
                    ret["border" + arr[i] + "Color"] = rgba;
                }
                return ret;
            }
        },
        _lock: function () {
            this.set("lock", this.lockNode.checked);
            this._onChange();
        },
        _adjustClass: function () {
            query("[data-edge]", this.domNode).removeClass("active").filter(lang.hitch(this, function (el) {
                return this.edge == "" || domAttr.get(el, "data-edge") == this.edge;
            })).addClass("active");
        },
        _setLockAttr: function (lock) {
            this._set("lock", lock);
            this.set("edge", this.lock ? "" : "Top");
            domProp.set(this.lockNode, "checked", lock);
            domStyle.set(this.noteNode, "display", this.lock ? "none" : "block");
        },
        _setEdgeAttr: function (edge) {
            this._set("edge", edge);
            this._adjustClass();
            this._edit();
        },
        _edit: function () {
            if (this.cs) {
                this.__fireChange = false;
                var cs = this.cs, ed = this.edge || "Top";
                this.widthSpinner.set("value", cs["border" + ed + "Width"]);
                this.styleNode.value = cs["border" + ed + "Style"];
                this.colorBox.set("value", cs["border" + ed + "Color"]);
                this.__fireChange = true;
            }
        },
        reset: function () {
            this.cs = null;
            this.set("lock", false);
            this.set("edge", "Top");
            this.widthSpinner.set("value", "0px");
            this.styleNode.value = "none";
            this.colorBox.set("value", "");
        },
        _onChange: function () {
            this.onChange(this.css());
        },
        onChange: function (css) {
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.widthSpinner;
            delete this.colorBox;
            delete this.styleNode;
        }
    });
});
