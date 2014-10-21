define([
    "dojo/_base/declare",
    "dojo/has",
    "dojo/sniff",
    "dojo/dom-prop",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/ShadowPanel.html",
    "./CircleSlider",
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
        circleSlider: null,
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
            var self = this;

            function _onChange() {
                self.onChange(self.css());
            }

            this.own([
                this.circleSlider.on("change", function (newValue) {
                    self.directionSpinner.set("value", newValue);
                }),
                this.directionSpinner.on("change", function (newValue) {
                    self.circleSlider.set("value", newValue);
                    _onChange();
                }),
                this.distanceSpinner.on("change", _onChange),
                this.blurSpinner.on("change", _onChange),
                this.sizeSpinner.on("change", _onChange),
                this.colorBox.on("change", _onChange)
            ]);
        },
        css: function (css) {
            if (css) {
                var shadow = css["boxShadow"], enable = shadow != "none";
                this.set("enable", enable);
                if (enable) {
                    debugger;
                    var arr = shadow.match(/\d+px/ig);
                    var c = shadow.match(/rgb\(.*\)/ig)[0],
                        h = toFloat(arr[0]), v = toFloat(arr[1]),
                        b = toFloat(arr[2]), s = toFloat(arr[3]),
                        z = Math.sqrt(Math.pow(h, 2) + Math.pow(v, 2)),
                        distance = Math.round(z),
                        angle = Math.round(Math.asin(v / z) * 180 / Math.PI);

                    this.circleSlider.set("value", angle);
                    this.distanceSpinner.set("value", distance);
                    this.blurSpinner.set("value", toFloat(b));
                    this.sizeSpinner.set("value", toFloat(s));
                    this.colorBox.set("value", c);
                }
            } else {
                if (this.enable) {
                    var direction = this.directionSpinner.get("value"),
                        distance = this.distanceSpinner.get("value"),
                        blur = this.blurSpinner.get("value"),
                        size = this.sizeSpinner.get("value"),
                        color = this.colorBox.get("value"),
                        h, v;
                    h = Math.round(Math.sin(direction * Math.PI / 180) * distance);
                    v = Math.round(Math.cos(direction * Math.PI / 180) * distance);
                    return {
                        boxShadow: [color, h + 'px', v + 'px', blur + 'px', size + 'px'].join(' ')
                    };
                }
                return{
                    boxShadow: "none"
                };
            }
        },
        reset: function () {
            this.circleSlider.set("value", 0);
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
        onChange: function (css) {
            console.log(css);
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
