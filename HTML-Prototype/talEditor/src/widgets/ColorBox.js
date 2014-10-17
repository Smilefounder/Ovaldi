define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/Color",
    "dojo/on",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    //"dojox/widget/ColorPicker",
    "./ColorPicker",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dojo/text!./templates/ColorBox.html"
], function (declare, lang, Color, on, _WidgetBase, _TemplatedMixin, ColorPicker, domConstruct, domStyle, domGeometry, template) {
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-color-input",
        templateString: template,
        swatchNode: null,
        picker: null,
        inputNode: null,
        value: "",
        showInput: false,
        __focusing: false,
        constructor: function (params) {
            declare.safeMixin(this, params);
        },
        postCreate: function () {
            this.inherited(arguments);
            this._initColorPicker();
            this._hideColorPicker();
            this.set("showInput", this.showInput);
            this.own([
                on(this.swatchNode, 'click', lang.hitch(this, function () {
                    this._showColorPicker();
                })),
                on(this.inputNode, "blur", lang.hitch(this, function () {
                    this._updateColor(this.inputNode.value, true);
                })),
                on(this.domNode, "mouseenter", lang.hitch(this, function (e) {
                    this.__focusing = true;
                })),
                on(this.domNode, "mouseleave", lang.hitch(this, function (e) {
                    this.__focusing = false;
                })),
                on(document, "click", lang.hitch(this, function (e) {
                    !this.__focusing && this._hideColorPicker();
                }))
            ]);
        },
        _initColorPicker: function () {
            var picker = this.picker = new ColorPicker({
                value: this.value || "#ffffff"
            });
            picker.placeAt(this.ownerDocument.body);
            picker.startup();

            this.own([
                picker.on("change", lang.hitch(this, function (color) {
                    this._updateColor(color);
                })),
                on(picker.domNode, "mouseenter", lang.hitch(this, function (e) {
                    this.__focusing = true;
                })),
                on(picker.domNode, "mouseleave", lang.hitch(this, function (e) {
                    this.__focusing = false;
                }))
            ]);
        },
        _updateColor: function (color, updatePicker) {
            var col = Color.fromString(color || "#ffffff"),
                hex = col.toHex(),
                rgba = col.toString(),
                fireChange = this.value != rgba;

            this.inputNode.value = hex;
            this._set("value", rgba);
            domStyle.set(this.swatchNode, "backgroundColor", rgba);
            if (updatePicker) {
                this.picker.set("value", rgba);
            }
            if (fireChange) {
                this.onChange(this.value);
            }
        },
        _showColorPicker: function () {
            var position = domGeometry.position(this.domNode, true);
            domStyle.set(this.picker.domNode, {
                position: "absolute",
                zIndex: 10000,
                left: position.x + "px",
                top: (position.y + position.h) + "px",
                display: "block"
            });
        },
        _hideColorPicker: function () {
            domStyle.set(this.picker.domNode, "display", "none");
        },
        _setValueAttr: function (color) {
            this._updateColor(color, true);
        },
        _setShowInputAttr: function (showInput) {
            this._set("showInput", showInput);
            domStyle.set(this.inputNode, "display", this.showInput ? "display" : "none");
        },
        onChange: function (newValue) {
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.picker;
            delete this.swatchNode;
            delete this.inputNode;
        }
    });
});