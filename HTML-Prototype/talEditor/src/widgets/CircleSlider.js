/**
 * Created by Raoh on 2014/10/18.
 */
define([
    "dojo/on",
    "dojo/touch",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/CircleSlider.html"
], function (on, touch, declare, lang, domStyle, geom, _WidgetBase, _TemplatedMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-circle-slider",
        templateString: template,
        knobNode: null,
        circleNode: null,
        radius: 24,
        value: 0,
        constructor: function () {
            this._handlers = [];
        },
        startup: function () {
            this.inherited(arguments);
            //不能直接通过geom.getContentBox获取宽高，因为某些情况下，dom处于不可视状态
            var cs = domStyle.getComputedStyle(this.circleNode);
            var h = parseFloat(cs["height"]) / 2, w = parseFloat(cs["width"]) / 2;
            this.set("radius", Math.min(h, w));
            this.setKnob(this.value);
        },
        _startDrag: function (e) {
            var de = this.ownerDocument;
            this._handlers = this._handlers.concat([
                on(de, touch.move, lang.hitch(this, function (e) {
                    var pos = geom.position(this.domNode, true);
                    var l = e.pageX - pos.x, t = e.pageY - pos.y;
                    this._compute(l, t);
                })),
                on(de, touch.release, lang.hitch(this, "_stopDrag"))
            ]);
            e.stopPropagation();
            e.preventDefault();
        },
        setKnob: function (angle) {
            var rad = this.radian(angle),
                left = this.radius + Math.sin(rad) * this.radius,
                top = this.radius - Math.cos(rad) * this.radius;
            domStyle.set(this.knobNode, {
                top: top + "px",
                left: left + "px"
            });
        },
        _compute: function (l, t) {
            var x = Math.abs(l - this.radius),
                y = Math.abs(t - this.radius),
                angle = Math.atan(x / y) * 180 / Math.PI;

            //四象
            if (l >= this.radius && t >= this.radius) {
                angle = 180 - angle;
            }
            //三象
            else if (l < this.radius && t >= this.radius) {
                angle += 180;
            }
            //二象
            else if (l < this.radius && t < this.radius) {
                angle = 360 - angle;
            }

            angle = Math.round(angle) % 360;
            this.set("value", angle);
        },
        _setValueAttr: function (angle) {
            angle = angle % 360;
            if (this.value != angle) {
                this._set("value", angle);
                this.setKnob(angle);
                this.onChange(angle);
            }
        },
        onChange: function (angle) {
        },
        _onClick: function (e) {
            var pos = geom.position(this.domNode, true);
            var l = e.pageX - pos.x, t = e.pageY - pos.y;
            this._compute(l, t);
        },
        _stopDrag: function () {
            this._cleanupHandlers();
        },
        _cleanupHandlers: function () {
            var h;
            while (h = this._handlers.pop()) {
                h.remove();
            }
        },
        //弧度数
        radian: function (n) {
            return n * Math.PI / 180
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.knobNode;
        }
    });
});
