/**
 * Created by Raoh on 2014/10/8.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/Color",
    "./BackgroundImagePanel",
    "dojo/text!./templates/BackgroundPanel.html",
    "dojo/i18n!./nls/BackgroundPanel",
    "ko"
], function (declare, lang, Color, BackgroundImagePanel, template, res, ko) {
    return declare([BackgroundImagePanel], {
        baseClass: "kb-background-panel",
        templateString: template,
        labelColor: "Color",
        labelOpacity: "Opacity",
        colorBox: null,
        opacitySlider: null,
        postMixInProperties: function () {
            lang.mixin(this, res);
            this.inherited(arguments);
        },
        startup: function () {
            this.inherited(arguments);
            var self = this;

            function _onChange() {
                self.onChange(self.css());
            }

            self.own([
                this.colorBox.on("change", _onChange),
                this.opacitySlider.on("change", _onChange)
            ]);
        },
        css: function (css) {
            if (css) {
                this.inherited(arguments);
                if (css["backgroundColor"]) {
                    var c = new Color(css["backgroundColor"]);
                    this.colorBox.set("value", c.toString());
                }
            } else {
                var ret = this.inherited(arguments);
                var rgba = this.colorBox.get("value");
                ret["backgroundColor"] = rgba;
                return ret;
            }
        },
        reset: function () {
            this.inherited(arguments);
            this.colorBox.set("value", "");
            this.opacitySlider.set("value", this.opacitySlider.max);
        }
    });
});
