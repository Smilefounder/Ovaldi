/**
 * Created by Raoh on 2014/10/8.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "./BackgroundImagePanel",
    "dojo/text!./templates/BackgroundPanel.html",
    "dojo/i18n!./nls/BackgroundPanel",
    "./ColorBox"
], function (declare, lang, BackgroundImagePanel, template, res) {
    return declare([BackgroundImagePanel], {
        baseClass: "kb-background-panel",
        templateString: template,
        labelColor: "Color",
        colorBox: null,
        postMixInProperties: function () {
            lang.mixin(this, res);
            this.inherited(arguments);
        },
        startup: function () {
            this.inherited(arguments);
            this.own(this.colorBox.on("change", lang.hitch(this, this._onChange)));
        },
        css: function (css) {
            if (css) {
                this.inherited(arguments);
                if (css["backgroundColor"]) {
                    this.colorBox.set("value", css["backgroundColor"]);
                }
            } else {
                var ret = this.inherited(arguments);
                ret["backgroundColor"] = this.colorBox.get("value");
                return ret;
            }
        },
        reset: function () {
            this.inherited(arguments);
            this.colorBox.set("value", "");
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.colorBox;
        }
    });
});
