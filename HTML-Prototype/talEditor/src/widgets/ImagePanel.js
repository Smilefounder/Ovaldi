/**
 * Created by Raoh on 2014/9/30.
 */
define([
    "dojo/on",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/ImagePanel.html",
    "dojo/i18n!./nls/ImagePanel",
    "ko"
], function (on, declare, lang, _WidgetBase, _TemplatedMixin, template, res, ko) {
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-image-panel",
        templateString: template,
        labelAlt: "ALT",
        labelTitle: "Title",
        labelSrc: "Image",
        buttonChange: "Change image",
        src: null,
        alt: null,
        title: null,
        srcNode: null,
        altNode: null,
        titleNode: null,
        callback: null,
        postMixInProperties: function () {
            lang.mixin(this, res);
            this.inherited(arguments);
        },
        startup: function () {
            this.inherited(arguments);
            this.own([
                on(this.altNode, "change", lang.hitch(this, this._onChange)),
                on(this.titleNode, "change", lang.hitch(this, this._onChange))
            ]);
        },
        value: function (obj) {
            if (obj) {
                this.srcNode.src = obj["src"] || "";
                this.altNode.value = obj["alt"] || "";
                this.titleNode.value = obj["title"] || "";
            } else {
                return this._getValue();
            }
        },
        _getValue: function () {
            return {
                src: this.srcNode.src,
                alt: this.altNode.value,
                title: this.titleNode.value
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
        _changeImage: function () {
            this.callback && this.callback();
            this._onChange();
        },
        _onChange: function () {
            this.onChange(this._getValue());
        },
        onChange: function () {
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.srcNode;
            delete this.altNode;
            delete this.titleNode;
        }
    });
});
