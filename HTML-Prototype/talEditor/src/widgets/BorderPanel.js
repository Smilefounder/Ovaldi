/**
 * Created by Raoh on 2014/9/30.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/Color",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/BorderPanel.html"
], function (declare, Color, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
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
        css: function (css) {
            if (css) {
                if (css["border-width"]) {
                    this.widthSpinner.set("value", css["border-width"]);
                }
                if (css["border-style"]) {
                    this.styleNode.value = css["border-style"];
                }
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
                ret["background-color"] = rgba;
                return ret;
            }
        },
        reset: function () {
            this.widthSpinner.set("value", "");
            this.styleNode.value = "none";
            this.colorBox.set("value", "");
            this.opacitySlider.set("value", this.opacitySlider.max);
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
