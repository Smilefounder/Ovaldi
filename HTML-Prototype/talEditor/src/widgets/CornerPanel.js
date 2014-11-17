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
    "dojo/text!./templates/CornerPanel.html",
    "./UnitSpinner"
], function (declare, lang, array, domStyle, domProp, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {

    var arr = ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"];
    var pascalAlpha = /^([a-z])/i;

    function fpamelCase(all, letter) {
        return (letter + "").toUpperCase();
    }

    function pascalCase(str) {
        return str.replace(pascalAlpha, fpamelCase);
    }

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        baseClass: "kb-corner-panel",
        templateString: template,
        effectNode: null,
        lockNode: null,

        lock: false,
        topLeftRadius: null,
        topRightRadius: null,
        bottomLeftRadius: null,
        bottomRightRadius: null,
        _onChangeActive: false,
        create: function () {
            this.inherited(arguments);
            this._onChangeActive = true;
        },
        startup: function () {
            this.inherited(arguments);
            this._preview();
            var self = this;

            this._syncing = false;
            array.forEach(arr, function (it) {
                self.own(self[it].on("change", function (newValue) {
                    if (self.lock && !self._syncing) {
                        self._syncing = true;
                        array.forEach(arr, function (ot) {
                            if (ot != it) {
                                self[ot].set("value", newValue);
                            }
                        });
                        self._syncing = false;
                    }
                    if (!self._syncing && self._onChangeActive) {
                        self.onChange(self.css());
                        self._preview();
                    }
                }));
            });
        },
        _preview: function () {
            array.forEach(arr, lang.hitch(this, function (it) {
                domStyle.set(this.effectNode, it.css, this[it].get("value"));
            }));
        },
        css: function (css) {
            var self = this;
            if (css) {
                this.set("lock", this.isIdentical(css));
                array.forEach(arr, function (it) {
                    self[it].set("value", css["border" + pascalCase(it)]);
                });
            } else {
                var ret = {};
                array.forEach(arr, function (it) {
                    ret["border" + pascalCase(it)] = self[it].get("value");
                });
                return ret;
            }
        },
        _lock: function () {
            this.set("lock", this.lockNode.checked);
        },
        _setLockAttr: function (lock) {
            this._set("lock", lock);
            lock && this.sync();
            domProp.set(this.lockNode, "checked", lock);
        },
        sync: function () {
            var self = this, val = this.topLeftRadius.get("value");
            this._syncing = true;
            array.forEach(arr, function (it) {
                self[it].set("value", val);
            });
            this._syncing = false;
            if (this._onChangeActive) {
                this.onChange(this.css());
                this._preview();
            }
        },
        isIdentical: function (cs) {
            var tl = cs["borderTopLeftRadius"];
            return array.every(arr, function (it) {
                return tl == cs["border" + pascalCase(it)];
            });
        },
        onChange: function (css) {
        },
        reset: function () {
            this.set("lock", false);
            array.forEach(arr, lang.hitch(this, function (it) {
                this[it].set("value", "0px");
            }));
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.lockNode;
            delete this.topLeftRadius;
            delete this.topRightRadius;
            delete this.bottomLeftRadius;
            delete this.bottomRightRadius;
        }
    });
});
