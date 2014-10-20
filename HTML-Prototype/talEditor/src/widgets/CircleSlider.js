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
    /*
     //example
     var r = 180;
     var b = document.getElementById("earth");
     var a = 0;
     var xy = {top: 0, left: 0};
     setInterval(function(){
     xy.top = 300 - Math.sin(a)* r;
     xy.left = 400 - Math.cos(a)* r;
     b.setAttribute("style", 'top: ' + xy.top + 'px; left: ' + xy.left + 'px');
     a += 0.01;
     },10);
     */
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-circle-slider",
        templateString: template,
        radius: 50,
        knobNode: null,
        value: 0,
        constructor: function () {
            this._handlers = [];
        },
        postCreate: function () {
            this.inherited(arguments);
            this.set("value", 0);
        },
        _startDrag: function (e) {
            var de = this.ownerDocument;
            this._handlers = this._handlers.concat([
                on(this.domNode, touch.move, lang.hitch(this, function (e) {
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
                left = 50 + Math.sin(rad) * this.radius,
                top = 50 - Math.cos(rad) * this.radius;
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

            angle = Math.round(angle) % 360;
            this.set("value", angle);
        },
        _setValueAttr: function (angle) {
            angle = angle % 360;
            if (this.angle != angle) {
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
        }
    });
});
