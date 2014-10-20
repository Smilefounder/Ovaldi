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
        radius: 50,
        knobNode: null,
        angle: 0,
        constructor: function () {
            this._handlers = [];
        },
        postCreate: function () {
            this.inherited(arguments);
            this.setKnob(0);
        },
        _startDrag: function (e) {
            var de = this.ownerDocument;
            this._handlers = this._handlers.concat([
                on(this.domNode, touch.move, lang.hitch(this, function (e) {
                    var pos = geom.position(this.domNode, true);
                    var l = e.pageX - pos.x, t = e.pageY - pos.y;
                    this._compute(l, t);
                })),
                on(this.domNode, "dragstart", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                }),
                on(this.domNode, "selectstart", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                }),
                on(de, touch.release, lang.hitch(this, "_stopDrag"))
            ]);
            e.stopPropagation();
            e.preventDefault();
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
        setKnob: function (angle) {
            var rad = this.radian(angle);
            var left = 50 + Math.sin(rad) * this.radius;
            var top = 50 - Math.cos(rad) * this.radius;
            domStyle.set(this.knobNode, {
                position: "relative",
                top: top + "px",
                left: left + "px"
            });
        },
        _compute: function (l, t) {
            var x = Math.abs(l - this.radius);
            var y = Math.abs(t - this.radius);
            var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            var sin = x / z;
            var angle = Math.asin(sin) * 180 / Math.PI;
            //四象
            if (l > 50 && t >= 50) {
                angle = 180 - angle;
            }
            //三象
            else if (l < 50 && t >= 50) {
                angle += 180;
            }
            //二象
            else if (l <= 50 && t < 50) {
                angle = 360 - angle;
            }

            angle = angle > 359 ? 0 : Math.round(angle);
            console.log(angle);
            this.setKnob(angle);
        },
        _onClick: function (e) {
            var pos = geom.position(this.domNode, true);
            var l = e.offsetX || e.pageX - pos.x, t = e.offsetY || e.pageY - pos.y;
            this._compute(l, t);
        },
        //弧度数
        radian: function (n) {
            return n * Math.PI / 180
        }
    });
});
