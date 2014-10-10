/**
 * Created by Raoh on 2014/9/30.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-attr",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/BackgroundImagePanel.html",
    "dojo/i18n!./nls/BackgroundImagePanel"
], function (declare, lang, domAttr, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, res) {
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
        postMixInProperties: function () {
            lang.mixin(this, res);
            this.inherited(arguments);
        },
        css: function (css) {
            if (css) {
                if (css["background-image"]) {
                    this.srcNode.src = css["background-image"].slice(4, -1);
                }
                if (css["background-repeat"]) {
                    this.repeatedNode.value = css["background-repeat"];
                }
                if (css["background-position-x"]) {
                    this.positionXRef.set("value", css["background-position-x"]);
                }
                if (css["background-position-y"]) {
                    this.positionYRef.set("value", css["background-position-y"]);
                }
            } else {
                return {
                    "background-image": this.srcNode.src ? 'url(' + this.srcNode.src + ')' : '',
                    "background-repeat": this.repeatedNode.value,
                    "background-position-x": this.positionXRef.get("value"),
                    "background-position-y": this.positionYRef.get("value")
                };
            }
        },
        _onChange: function (e) {
            this.emit("Change");
        },
        onChange: function () {
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