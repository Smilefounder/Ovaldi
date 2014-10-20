define([
    "dojo/_base/declare",
    "dojo/has",
    "dojo/sniff",
    "dojo/dom-prop",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/ShadowPanel.html",
    "./UnitSpinner",
    "./ColorBox"
], function (declare, has, sniff, domProp, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
    function toFloat(str) {
        return parseFloat(str) || 0;
    }

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        baseClass: "kb-shadow-panel",
        templateString: template,
        labelEnableShadow: "Enable shadow",
        labelDirection: "Direction",
        labelDistance: "Distance",
        labelBlur: "Blur",
        labelSize: "Size",
        labelColor: "Color",
        labelOpacity: "Opacity",
        directionSpinner: null,
        distanceSpinner: null,
        blurSpinner: null,
        sizeSpinner: null,
        colorBox: null,
        enableNode: null,
        enable: false,
        postCreate: function () {
            this.inherited(arguments);
            this.set("enable", this.enable);
        },
        css: function (css) {
            if (css) {
                var shadow = css["box-shadow"], enable = shadow != "none";
                this.set("enable", enable);
                if (enable) {
                    var arr = shadow.match(/\d+px/ig);
                    var c = shadow.match(/rgb\(.*\)/ig)[0], h = toFloat(arr[0]), v = toFloat(arr[1]), b = toFloat(arr[2]), s = toFloat(arr[3]);

                    var angle = (h == 0 || v == 0) ? 0 : Math.atan(v / h) * 180 / Math.PI;
                    var edge = Math.round(Math.sqrt(Math.pow(h, 2) + Math.pow(v, 2)));
                    console.log("angle", angle, "edge", edge, "h", h, "v", v);
                    this.directionSpinner.set("value", Math.round(angle));
                    this.distanceSpinner.set("value", edge);
                    this.blurSpinner.set("value", toFloat(b));
                    this.sizeSpinner.set("value", toFloat(s));
                    this.colorBox.set("value", c);
                }
            } else {

            }
        },
        reset: function () {
            this.directionSpinner.set("value", 0);
            this.distanceSpinner.set("value", 0);
            this.blurSpinner.set("value", 0);
            this.sizeSpinner.set("value", 0);
            this.colorBox.set("value", "");
        },
        _enable: function () {
            this.set("enable", this.enableNode.checked);
        },
        _setEnableAttr: function (enable) {
            this._set("enable", enable);
            domProp.set(this.enableNode, "checked", enable);
            if (!enable) {
                this.reset();
            }
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.directionSpinner;
            delete this.distanceSpinner;
            delete this.blurSpinner;
            delete this.sizeSpinner;
            delete this.colorBox;
        }
    });
});
