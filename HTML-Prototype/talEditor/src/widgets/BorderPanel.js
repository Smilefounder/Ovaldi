/**
 * Created by Raoh on 2014/9/30.
 */
define([
    "dojo/on",
    "dojo/_base/array",
    "dojo/query",
    "dojo/_base/declare",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-attr",
    "dojo/dom-prop",
    "dojo/_base/lang",
    "dojo/_base/Color",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/BorderPanel.html",
    "./Spinner",
    "./ColorBox"
], function (on, array, query, declare, domClass, domStyle, domAttr, domProp, lang, Color, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
    function toFloat(str) {
        return parseFloat(str) || 0;
    }

    var pascalAlpha = /^([a-z])/i;

    function fpamelCase(all, letter) {
        return (letter + "").toUpperCase();
    }

    function pascalCase(str) {
        return str.replace(pascalAlpha, fpamelCase);
    }

    var widths = ["topWidth", "rightWidth", "bottomWidth", "leftWidth"],
        styles = ["topStyle", "rightStyle", "bottomStyle", "leftStyle"],
        colors = ["topColor", "rightColor", "bottomColor", "leftColor"];

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        baseClass: "kb-border-panel",
        templateString: template,
        lockNode: null,
        topWidth: null,
        topStyle: null,
        topColor: null,
        rightWidth: null,
        rightStyle: null,
        rightColor: null,
        bottomWidth: null,
        bottomStyle: null,
        bottomColor: null,
        leftWidth: null,
        leftStyle: null,
        leftColor: null,
        lock: false,
        _onChangeActive: false,
        create: function () {
            this.inherited(arguments);
            this._onChangeActive = true;
        },
        postCreate: function () {
            this.inherited(arguments);
            this.set("lock", this.lock);
            var self = this;

            this._widthSyncing = false;
            this._styleSyncing = false;
            this._colorSyncing = false;
            array.forEach(widths, function (it) {
                self.own(self[it].on("change", function (newValue) {
                    if (self.lock && !self._widthSyncing) {
                        self._widthSyncing = true;
                        array.forEach(widths, function (ot) {
                            if (ot != it) {
                                self[ot].set("value", newValue);
                            }
                        });
                        self._widthSyncing = false;
                    }
                    if (!self._widthSyncing && self._onChangeActive) {
                        self.onChange(self.css());
                    }
                }));
            });
            array.forEach(styles, function (it) {
                var sel = self[it];
                self.own(on(sel, "change", function () {
                    if (self.lock && !self._styleSyncing) {
                        self._styleSyncing = true;
                        array.forEach(styles, function (ot) {
                            if (ot != it) {
                                self[ot].value = sel.value;
                            }
                        });
                        self._styleSyncing = false;
                    }
                    if (!self._styleSyncing && self._onChangeActive) {
                        self.onChange(self.css());
                    }
                }));
            });
            array.forEach(colors, function (it) {
                self.own(self[it].on("change", function (newValue) {
                    if (self.lock && !self._colorSyncing) {
                        self._colorSyncing = true;
                        array.forEach(colors, function (ot) {
                            if (ot != it) {
                                self[ot].set("value", newValue);
                            }
                        });
                        self._colorSyncing = false;
                    }
                    if (!self._colorSyncing && self._onChangeActive) {
                        self.onChange(self.css());
                    }
                }));
            });
        },
        css: function (css) {
            if (css) {
                this.cs = css;
                this._edit();
            } else {
                var ret = {}, self = this;
                array.forEach(widths, function (it) {
                    ret["border" + pascalCase(it)] = self[it].get("value") + "px";
                });
                array.forEach(styles, function (it) {
                    ret["border" + pascalCase(it)] = self[it].value;
                });
                array.forEach(colors, function (it) {
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
            var self = this, w = this.topWidth.get("value"), s = this.topStyle.value, c = this.topColor.get("value");
            this._widthSyncing = true;
            array.forEach(widths, function (it) {
                self[it].set("value", w);
            });
            this._widthSyncing = false;
            this._styleSyncing = true;
            array.forEach(styles, function (it) {
                self[it].value = s;
            });
            this._styleSyncing = false;
            this._colorSyncing = true;
            array.forEach(colors, function (it) {
                self[it].set("value", c);
            });
            this._colorSyncing = false;
            if (this._onChangeActive) {
                this.onChange(this.css());
            }
        },
        _edit: function () {
            if (this.cs) {
                var cs = this.cs, self = this;
                array.forEach(widths, function (it) {
                    self[it].set("value", toFloat(cs["border" + pascalCase(it)]));
                });
                array.forEach(styles, function (it) {
                    self[it].value = cs["border" + pascalCase(it)];
                });
                array.forEach(colors, function (it) {
                    self[it].set("value", cs["border" + pascalCase(it)]);
                });
            }
        },
        reset: function () {
            this.cs = null;
            this.set("lock", false);
            var self = this;
            array.forEach(widths, function (it) {
                self[it].set("value", 0);
            });
            array.forEach(styles, function (it) {
                self[it].value = "none";
            });
            array.forEach(colors, function (it) {
                self[it].set("value", "");
            });
        },
        onChange: function (css) {
            this.defer(function(){
                this._edit();
            },50);
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.lockNode;
            delete this.topWidth;
            delete this.topStyle;
            delete this.topColor;
            delete this.rightWidth;
            delete this.rightStyle;
            delete this.rightColor;
            delete this.bottomWidth;
            delete this.bottomStyle;
            delete this.bottomColor;
            delete this.leftWidth;
            delete this.leftStyle;
            delete this.leftColor;
        }
    });
});
