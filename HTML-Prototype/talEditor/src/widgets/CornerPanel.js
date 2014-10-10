/**
 * Created by Raoh on 2014/9/30.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/dom-style",
    "dojo/dom-prop",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/CornerPanel.html"
], function (declare, lang, array, domStyle, domProp, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
    var styleMap = [
        {css: "border-top-left-radius", to: "tlRef"},
        {css: "border-top-right-radius", to: "trRef"},
        {css: "border-bottom-left-radius", to: "blRef"},
        {css: "border-bottom-right-radius", to: "brRef"}
    ];
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        baseClass: "kb-corner-panel",
        templateString: template,
        effectNode: null,
        lockNode: null,
        together: true,
        tlRef: null,
        trRef: null,
        blRef: null,
        brRef: null,
        startup: function () {
            this.inherited(arguments);
            var self = this, syncing = false;

            function _sync(spinner) {
                if (syncing || !self.together) {
                    return;
                }
                syncing = true;
                var value = spinner.get("value");
                if (self.tlRef != spinner) {
                    self.tlRef.set("value", value);
                }
                if (self.trRef != spinner) {
                    self.trRef.set("value", value);
                }
                if (self.blRef != spinner) {
                    self.blRef.set("value", value);
                }
                if (self.brRef != spinner) {
                    self.brRef.set("value", value);
                }
                syncing = false;
            }

            this.own([
                this.tlRef.on("change", function (value) {
                    domStyle.set(self.effectNode, "border-top-left-radius", value);
                    _sync(this);
                }),
                this.trRef.on("change", function (value) {
                    domStyle.set(self.effectNode, "border-top-right-radius", value);
                    _sync(this);
                }),
                this.blRef.on("change", function (value) {
                    domStyle.set(self.effectNode, "border-bottom-left-radius", value);
                    _sync(this);
                }),
                this.brRef.on("change", function (value) {
                    domStyle.set(self.effectNode, "border-bottom-right-radius", value);
                    _sync(this);
                })
            ]);
        },
        sync: function (value) {
            this.tlRef.set("value", value);
            this.trRef.set("value", value);
            this.blRef.set("value", value);
            this.brRef.set("value", value);
        },
        css: function (css) {
            var self = this;
            if (css) {
                array.forEach(styleMap, function (item) {
                    if (item.css in css) {
                        self[item.to].set("value", css[item.css]);
                        domStyle.set(self.effectNode, item.css, css[item.css]);
                    }
                });
            } else {
                var ret = {};
                array.forEach(styleMap, function (item) {
                    ret[item.css] = self[item.to].get("value");
                });
                return ret;
            }
        },
        getCorner: function () {
            var self = this, ret = {};
            array.forEach(styleMap, function (item) {
                ret[item.css] = self[item.to].get("value");
            });
            return ret;
        },
        _lockTogether: function () {
            this.set("together", !this.together);
        },
        _setTogetherAttr: function (together) {
            this._set("together", together);
            domProp.set(this.lockNode, "checked", this.together);
            if (this.together) {
                var value = this.tlRef.get("value") || this.trRef.get("value") || this.blRef.get("value") || this.brRef.get("value");
                this.sync(value);
            }
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.lockNode;
        }
    });
});
