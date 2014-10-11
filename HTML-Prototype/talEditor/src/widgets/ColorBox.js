define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/Color",
    "dojo/on",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojox/widget/ColorPicker",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dojo/text!./templates/ColorBox.html"
], function (declare, lang, Color, on, _WidgetBase, _TemplatedMixin, ColorPicker, domConstruct, domStyle, domGeometry, template) {
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-color-input",
        templateString: template,
        swatchNode: null,
        colorPickerRef: null,
        value: "",
        focusing: false,
        constructor: function (params) {
            declare.safeMixin(this, params);
        },
        postCreate: function () {
            this.inherited(arguments);
            this._initColorPicker();
            this._hideColorPicker();

            this.own([
                on(this.swatchNode, 'click', lang.hitch(this, function () {
                    this._showColorPicker();
                })),
                on(this.textbox, "blur", lang.hitch(this, function () {
                    this.set("value", this.textbox.value);
                })),
                on(this.domNode, "mouseenter", lang.hitch(this, function (e) {
                    this.focusing = true;
                })),
                on(this.domNode, "mouseleave", lang.hitch(this, function (e) {
                    this.focusing = false;
                })),
                on(document, "click", lang.hitch(this, function (e) {
                    !this.focusing && this._hideColorPicker();
                }))
            ]);
        },
        _initColorPicker: function () {
            this.colorPickerRef = new ColorPicker({
                value: this.value || "#ffffff"
            });
            this.colorPickerRef.placeAt(this.ownerDocument.body);
            this.colorPickerRef.startup();

            this.own([
                this.colorPickerRef.on("change", lang.hitch(this, function (color) {
                    this._updateColor(color);
                })),
                on(this.colorPickerRef.domNode, "mouseenter", lang.hitch(this, function (e) {
                    this.focusing = true;
                })),
                on(this.colorPickerRef.domNode, "mouseleave", lang.hitch(this, function (e) {
                    this.focusing = false;
                }))
            ]);
        },
        _updateColor: function (color, updatePicker) {
            if (color) {
                color = Color.fromString(color).toHex();
            }
            this._set("value", color);
            this.textbox.value = color;
            domStyle.set(this.swatchNode, "backgroundColor", color);
            if (color && updatePicker) {
                this.colorPickerRef.set("value", color);
            }
            this.onChange(this.get("value"));
        },
        _showColorPicker: function () {
            var position = domGeometry.position(this.domNode, true);
            domStyle.set(this.colorPickerRef.domNode, {
                position: "absolute",
                zIndex: 10000,
                left: position.x + "px",
                top: (position.y + position.h) + "px",
                display: "block"
            });
        },
        _hideColorPicker: function () {
            domStyle.set(this.colorPickerRef.domNode, "display", "none");
        },
        _setValueAttr: function (color) {
            this._updateColor(color, true);
        },
        onChange: function (newValue) {
        },
        destroy: function () {
            this.inherited(arguments);
            this.colorPickerRef && this.colorPickerRef.destroyRecursive();
            delete this.colorPickerRef;
            delete this.swatchNode;
            delete this.textbox;
        }
    });
});