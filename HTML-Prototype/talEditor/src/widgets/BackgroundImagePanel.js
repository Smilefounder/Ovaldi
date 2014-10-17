/**
 * Created by Raoh on 2014/9/30.
 */
define([
    "dojo/on",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-attr",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/BackgroundImagePanel.html",
    "dojo/i18n!./nls/BackgroundImagePanel",
    "tal/widgets/UnitSpinner",
    "tal/widgets/ColorBox",
    "tal/widgets/Slider"
], function (on, declare, lang, domAttr, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, res) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        baseClass: "kb-background-image-panel",
        templateString: template,
        labelRepeated: "Repeated",
        labelPositionX: "Position X",
        labelPositionY: "Position Y",
        labelSrc: "Image",
        labelClearSrc: "Clear",
        buttonChange: "Change image",
        srcNode: null,
        repeatedNode: null,
        positionXRef: null,
        positionYRef: null,
        callback: null,
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

            this.own([
                on(this.repeatedNode, "change", _onChange),
                on(this.positionXRef, "change", _onChange),
                on(this.positionYRef, "change", _onChange)
            ]);
        },
        css: function (css) {
            if (css) {
                this.srcNode.src = css["backgroundImage"] == "none" ? "" : css["backgroundImage"].slice(4, -1);
                this.repeatedNode.value = css["backgroundRepeat"] || "";
                var xy = (css["backgroundPosition"] || "").split(' ');
                this.positionXRef.set("value", xy[0] || "");
                this.positionYRef.set("value", xy[1] || "");

            } else {
                return {
                    "backgroundImage": this.srcNode.src ? 'url(' + this.srcNode.src + ')' : '',
                    "backgroundRepeat": this.repeatedNode.value,
                    "backgroundPosition": this.positionXRef.get("value") + ' ' + this.positionYRef.get("value")
                };
            }
        },
        onChange: function (css) {
        },
        _changeImage: function () {
            this.callback && this.callback();
            this.onChange(this.css());
        },
        _clearSrc: function () {
            this.srcNode.src = "";
        },
        reset: function () {
            this.srcNode.src = "";
            this.repeatedNode.value = "";
            this.positionXRef.set("value", "");
            this.positionYRef.set("value", "");
        }
    });
});