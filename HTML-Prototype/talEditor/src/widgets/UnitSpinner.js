/**
 * Created by Raoh on 2014/10/9.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/UnitSpinner.html"
], function (declare, lang, on, _WidgetBase, _TemplatedMixin, template) {
    var nonNumericRegExp = /^[^\d]*$/;
    return declare([_WidgetBase, _TemplatedMixin], {
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
                    self._set("number", this.value);
                    self.onChange(self.get("value"));
                },
                change: function () {
                    self._set("number", this.value);
                    self.onChange(self.get("value"));
                }
            });
        },
        _parse: function (val) {
            var number = parseFloat(val), unit;
            if (!isNaN(number) && val.slice) {
                var len = -3;//rem,em,px,pt...
                while (len < 0) {
                    if (nonNumericRegExp.test(val.slice(len))) {
                        unit = val.slice(len);
                        break;
                    }
                    len++;
                }
            }
            this.set({
                "number": isNaN(number) ? "" : number,
                "unit": unit || "px"
            });
            this.onChange(this.get("value"));
        },
        _getValueAttr: function () {
            function trimAll(str) {
                return str.replace(/\s/g, '');
            }

            var number = trimAll(this.get("number")),
                unit = this.get("unit");
            return number.length ? (number + unit) : "";
        },
        _setValueAttr: function (value) {
            this._parse(value);
        },
        _getNumberAttr: function () {
            return this.numberNode.value;
        },
        _setNumberAttr: function (number) {
            this._set("number", number);
            this.numberNode.value = number;
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
