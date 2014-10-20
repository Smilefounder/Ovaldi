/**
 * Created by Raoh on 2014/10/9.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/UnitSpinner.html",
    "tal/string"
], function (declare, lang, on, _WidgetBase, _TemplatedMixin, template, string) {
    var numberRegExp = /^\d/;
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-unit-spinner",
        templateString: template,
        min: 0,
        number: 0,
        unit: "px",
        value: "0px",
        numberNode: null,
        unitNode: null,
        buildRendering: function () {
            this.inherited(arguments);
            var self = this;
            $(this.numberNode).spinner({
                min: this.min,
                create: function () {
                    this.value = self.number;
                },
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
                        self.set("number", self.numberNode.value);
                    }, 0);
                })),
                on(this.numberNode, "blur", lang.hitch(this, function (e) {
                    this.set("number", this.numberNode.value);
                }))
            ]);
        },
        _setValueAttr: function (value) {
            var oldValue = this.value, number = parseFloat(value) || 0, unit = "px";
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
            this.set("unit", unit);//先赋值Unit，否则赋值number时触发onChange事件，取不到unit值
            this.set("number", number);
        },
        _setNumberAttr: function (number) {
            if (this.number != number) {
                var n = parseFloat(number) || 0;
                this._set("number", n);
                this.numberNode.value = this.number;
                this.value = this.number + this.unit;
                this.onChange(this.value);
            }
        },
        _setUnitAttr: function (unit) {
            this._set("unit", unit);
            this.value = this.number + this.unit;
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
