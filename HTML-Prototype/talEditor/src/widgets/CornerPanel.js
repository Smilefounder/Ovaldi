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
        {css: "borderTopLeftRadius", to: "tlRef"},
        {css: "borderTopRightRadius", to: "trRef"},
        {css: "borderBottomLeftRadius", to: "blRef"},
        {css: "borderBottomRightRadius", to: "brRef"}
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
                if (!syncing && self.together) {
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
                self._preview();
            }

            this.own([
                this.tlRef.on("change", function (value) {
                    _sync(this);
                    self._onChange();
                }),
                this.trRef.on("change", function (value) {
                    _sync(this);
                    self._onChange();
                }),
                this.blRef.on("change", function (value) {
                    _sync(this);
                    self._onChange();
                }),
                this.brRef.on("change", function (value) {
                    _sync(this);
                    self._onChange();
                })
            ]);
        },
        _preview: function () {
            array.forEach(styleMap, lang.hitch(this, function (item) {
                domStyle.set(this.effectNode, item.css, this[item.to].get("value"));
            }));
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
        _lockTogether: function () {
            this.set("together", !this.together);
        },
        _setTogetherAttr: function (together) {
            this._set("together", together);
            domProp.set(this.lockNode, "checked", this.together);
            if (this.together) {
                var value = this.tlRef.get("value") || this.trRef.get("value") || this.blRef.get("value") || this.brRef.get("value");
                this._preview();
            }
        },
        _onChange: function () {
            this.onChange(this.css());
        },
        onChange: function (css) {
        },
        reset: function () {
            array.forEach(styleMap, lang.hitch(this, function (item) {
                this[item.to].set("value", "");
            }));
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.lockNode;
        }
    });
});
