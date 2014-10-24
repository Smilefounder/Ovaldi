define([
    "dojo/_base/declare",
    "dojo/on",
    "dojo/sniff",
    "dojo/dom-prop",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/ShadowPanel.html",
    "./CircleSlider",
    "./UnitSpinner",
    "./ColorBox"
], function (declare, on, sniff, domProp, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
    function toFloat(str) {
        return parseFloat(str) || 0;
    }

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        baseClass: "kb-shadow-panel",
        templateString: template,
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
        insetNode: null,
        postCreate: function () {
            this.inherited(arguments);
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
                this.colorBox.on("change", _onChange),
                on(this.insetNode, "change", _onChange)
            ]);
        },
        css: function (css) {
            if (css) {
                var shadow = css["boxShadow"];
                if (shadow != 'none') {
                    var arr = shadow.match(/-?\d+px/ig),
                        c = shadow.match(/(rgb|rgba)\(.*\)/ig)[0],
                        inset = /inset$/.test(shadow),
                        h = toFloat(arr[0]), v = toFloat(arr[1]),
                        z = Math.pow(Math.pow(h, 2) + Math.pow(v, 2), 0.5),//Math.sqrt(Math.pow(h, 2) + Math.pow(v, 2))
                        b = toFloat(arr[2]), s = toFloat(arr[3]),
                        distance = Math.round(z),
                        tan = Math.abs(h / v),
                        angle = Math.atan(tan) * 180 / Math.PI;

                    //二象
                    if (h < 0 && v >= 0) {
                        angle = 360 - angle;
                    }
                    //三象
                    else if (h <= 0 && v < 0) {
                        angle += 180;
                    }
                    //四象
                    else if (h > 0 && v < 0) {
                        angle = 180 - angle;
                    }

                    angle = Math.round(angle);
                    this.circleSlider.set("value", angle);
                    this.distanceSpinner.set("value", distance);
                    this.blurSpinner.set("value", toFloat(b));
                    this.sizeSpinner.set("value", toFloat(s));
                    this.colorBox.set("value", c);
                    domProp.set(this.insetNode, "checked", inset);
                }
            } else {
                var direction = this.directionSpinner.get("value"),
                    distance = this.distanceSpinner.get("value"),
                    blur = this.blurSpinner.get("value"),
                    size = this.sizeSpinner.get("value"),
                    color = this.colorBox.get("value"),
                    inset = this.insetNode.checked,
                    h, v;
                h = Math.round(Math.sin(direction * Math.PI / 180) * distance);
                v = Math.round(Math.cos(direction * Math.PI / 180) * distance);
                return {
                    boxShadow: ((h | v | blur | size) == 0) ? "none" : [color, h + 'px', v + 'px', blur + 'px', size + 'px', inset ? 'inset' : ''].join(' ')
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
            domProp.set(this.insetNode, "checked", false);
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
})
;
