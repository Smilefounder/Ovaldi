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
                on(this.altNode, "keyup,change", lang.hitch(this, function () {
                    this._set("alt", this.altNode.value);
                    this.onChange();
                })),
                on(this.titleNode, "keyup,change", lang.hitch(this, function () {
                    this._set("title", this.titleNode.value);
                    this.onChange();
                }))
            ])
        },
        _setSrcAttr: function (src) {
            this._set("src", src);
            this.srcNode.src = src;
        },
        _setAltAttr: function (alt) {
            this._set("alt", alt);
            this.altNode.value = alt;
        },
        _setTitleAttr: function (title) {
            this._set("title", title);
            this.titleNode.value = title;
        },
        onChange: function () {
        },
        _changeImage: function () {
            this.callback && this.callback();
            this.onChange();
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.srcNode;
            delete this.altNode;
            delete this.titleNode;
        }
    });
});
