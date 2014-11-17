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
    "./UnitSpinner"
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
        constructor: function () {
            this.__src = (new Date).getTime();
        },
        postMixInProperties: function () {
            lang.mixin(this, res);
            this.inherited(arguments);
        },
        startup: function () {
            this.inherited(arguments);
            this.own([
                on(this.repeatedNode, "change", lang.hitch(this, this._onChange)),
                on(this.positionXRef, "change", lang.hitch(this, this._onChange)),
                on(this.positionYRef, "change", lang.hitch(this, this._onChange))
            ]);
        },
        css: function (css) {
            if (css) {
                if (css["backgroundImage"] == "none") {
                    //img标签的src属性不能为空，否则将自动指向当前页面的URL,并导致发起重复请求
                    this._clearSrc();
                } else {
                    this.srcNode.src = css["backgroundImage"].slice(4, -1);
                }

                this.repeatedNode.value = css["backgroundRepeat"] || "";
                var xy = (css["backgroundPosition"] || "").split(' ');
                this.positionXRef.set("value", xy[0] || "");
                this.positionYRef.set("value", xy[1] || "");

            } else {
                return {
                    "backgroundImage": domAttr.get(this.srcNode, "src") == this.__src ? 'none' : 'url(' + this.srcNode.src + ')',
                    "backgroundRepeat": this.repeatedNode.value,
                    "backgroundPosition": this.positionXRef.get("value") + ' ' + this.positionYRef.get("value")
                };
            }
        },
        src: function (src) {
            if (src) {
                this.srcNode.src = src;
                this._onChange();
            } else {
                return this.srcNode.src;
            }
        },
        _onChange: function () {
            this.onChange(this.css());
        },
        onChange: function (css) {
        },
        _changeImage: function () {
            this.callback && this.callback();
            this.onChange(this.css());
        },
        _clearSrc: function () {
            this.srcNode.src = this.__src;
            this.onChange(this.css());
        },
        reset: function () {
            this.srcNode.src = "";
            this.repeatedNode.value = "";
            this.positionXRef.set("value", "");
            this.positionYRef.set("value", "");
        }
    });
});