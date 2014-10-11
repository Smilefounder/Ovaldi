/**
 * Created by Raoh on 2014/9/30.
 */
define([
    "dojo/on",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/Color",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/BorderPanel.html"
], function (on,declare, lang, Color, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        baseClass: "kb-border-panel",
        templateString: template,
        labelWidth: "Width",
        labelStyle: "Style",
        labelColor: "Color",
        labelOpacity: "Opacity",
        widthSpinner: null,
        styleNode: null,
        colorBox: null,
        opacitySlider: null,
        startup: function () {
            this.inherited(arguments);
            var handler = lang.hitch(this, "_onChange");
            this.own([
                this.widthSpinner.on("change", handler),
                on(this.styleNode, "change",handler),
                this.colorBox.on("change",handler),
                this.opacitySlider.on("change",handler)
            ]);
        },
        css: function (css) {
            if (css) {
                this.widthSpinner.set("value", css["border-width"] || "");
                this.styleNode.value = css["border-style" || "none"];
                if (css["border-color"]) {
                    var c = new Color(css["border-color"]);
                    this.colorBox.set("value", c.toHex());
                    this.opacitySlider.set("value", c.a);
                }
            } else {
                var ret = {
                    "border-width": this.widthSpinner.get("value"),
                    "border-style": this.styleNode.value
                };
                var hex = this.colorBox.get("value"), rgba = "";
                if (hex) {
                    var c = new Color(hex);
                    c.a = this.opacitySlider.get("value");
                    rgba = c.toRgba();
                }
                ret["border-color"] = rgba;
                return ret;
            }
        },
        reset: function () {
            this.widthSpinner.set("value", "");
            this.styleNode.value = "none";
            this.colorBox.set("value", "");
            this.opacitySlider.set("value", this.opacitySlider.max);
        },
        _onChange: function () {
            this.onChange(this.css());
        },
        onChange: function (css) {console.log(css);
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.widthSpinner;
            delete this.colorBox;
            delete this.opacitySlider;
            delete this.styleNode;
        }
    });
});
