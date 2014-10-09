/**
 * Created by Raoh on 2014/9/30.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/ImagePanel.html",
    "dojo/i18n!./nls/ImagePanel",
    "ko"
], function (declare, lang, _WidgetBase, _TemplatedMixin, template, res, ko) {
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-image-panel",
        templateString: template,
        labelAlt: "ALT",
        labelTitle: "Title",
        labelSrc: "Image",
        buttonChange: "Change image",
        constructor: function () {
            this.src = ko.observable("");
            this.alt = ko.observable("");
            this.title = ko.observable("");
        },
        postMixInProperties: function () {
            lang.mixin(this, res);
            this.inherited(arguments);
        },
        startup: function () {
            this.inherited(arguments);
            ko.applyBindings(this, this.domNode);
        },
        _onChange: function (e) {
            this.emit("Change");
        },
        onChange: function () {
        }
    });
});
