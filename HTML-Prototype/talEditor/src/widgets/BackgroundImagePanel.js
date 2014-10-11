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
    "dojo/i18n!./nls/BackgroundImagePanel"
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
                this.srcNode.src = css["background-image"] == "none" ? "" : css["background-image"].slice(4, -1);
                this.repeatedNode.value = css["background-repeat"] || "";
                this.positionXRef.set("value", css["background-position-x"] || "");
                this.positionYRef.set("value", css["background-position-y"] || "");
            } else {
                return {
                    "background-image": this.srcNode.src ? 'url(' + this.srcNode.src + ')' : '',
                    "background-repeat": this.repeatedNode.value,
                    "background-position-x": this.positionXRef.get("value"),
                    "background-position-y": this.positionYRef.get("value")
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