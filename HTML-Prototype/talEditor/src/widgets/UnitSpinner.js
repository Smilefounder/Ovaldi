/**
 * Created by Raoh on 2014/10/9.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/UnitSpinner.html",
    "tal/string"
], function (declare, lang, on, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, string) {
    var numberRegExp = /^\d/;
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        baseClass: "kb-unit-spinner",
        templateString: template,
        min: 0,
        number: null,
        unit: "px",//default is "px"
        numberNode: null,
        unitNode: null,
        buildRendering: function () {
            this.inherited(arguments);
            var self = this;
            $(this.numberNode).spinner({
                min: this.min,
                stop: function () {
                    self.set("number", this.value);
                },
                change: function () {
                    self.set("number", this.value);
                }
            });
            this.own([
                on(this.numberNode, "paste", lang.hitch(this, function (e) {
                    var self = this;
                    setTimeout(function () {
                        self.set("number", parseFloat(self.numberNode.value) || 0);
                    }, 0);
                })),
                on(this.numberNode, "blur", lang.hitch(this, function (e) {
                    self.set("number", parseFloat(this.numberNode.value) || 0);
                }))
            ]);
        },
        _parse: function (value) {
            var number = parseFloat(value) || 0, unit = "px";
            if (value.slice) {
                var len = -3, val;//rem,em,px,pt,%...
                while (len < 0) {
                    if (!numberRegExp.test(val = value.slice(len))) {
                        unit = val;
                        break;
                    }
                    len++;
                }
            }
            this.set({
                "number": number,
                "unit": unit
            });
        },
        _getValueAttr: function () {
            return string.trimAll(this.get("number") + this.get("unit"));
        },
        _setValueAttr: function (value) {
            this._parse(value);
        },
        _setNumberAttr: function (number) {
            if (this.number != number) {
                this._set("number", number);
                this.numberNode.value = number;
                this.onChange(this.get("value"));
            }
        },
        _getUnitAttr: function () {
            return this.unit;
        },
        _setUnitAttr: function (unit) {
            this._set("unit", unit);
            this.unitNode.textContent = unit;
        },
        onChange: function (newValue) {
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.numberNode;
            delete this.unitNode;
        }
    });
});
