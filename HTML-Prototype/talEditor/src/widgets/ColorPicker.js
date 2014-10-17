/**
 * Created by Raoh on 2014/10/15.
 */
define([
    "dojo/on",
    "dojo/_base/declare",
    "dojo/_base/Color",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/ColorPicker.html",
    "dojox/widget/ColorPicker",
    "./Slider"
], function (on, declare, Color, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        baseClass: "kb-color-picker",
        templateString: template,
        picker: null,
        slider: null,
        clearNode: null,
        value: "rgba(0,0,0,0)",
        startup: function () {
            this.inherited(arguments);
            var self = this;
            this.own([
                this.picker.on("change", function (newValue) {
                    var col = Color.fromString(newValue);
                    self._updateSlider(col);
                    self._updateValue(col);
                    self.onChange(self.value);
                }),
                this.slider.on("change", function (newValue) {
                    var col = Color.fromString(self.picker.get("value"));
                    col.a = newValue;
                    self._updateValue(col);
                    self.onChange(self.value);
                })
            ]);
        },
        _updateSlider: function (col) {
            this.slider.set("value", col.a);
        },
        _updateValue: function (col) {
            this._set("value", col.toString());
        },
        _setValueAttr: function (value) {
            var col = Color.fromString(value);
            this._set("value", col.toString());
            this.picker.set("value", col.toHex());
            this._updateSlider(col);
        },
        clear: function () {
            this.slider.set("value", 0);
        },
        _onClear: function () {
            this.clear();
        },
        onChange: function (newValue) {
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.picker;
            delete this.slider;
            delete this.clearNode;
        }
    });
});