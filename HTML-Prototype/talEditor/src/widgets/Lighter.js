/**
 * Created by Raoh on 2014/8/14.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/Lighter.html"
], function (declare, lang, domStyle, geom, _WidgetBase, _TemplatedMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-Lighter",
        templateString: template,
        el: null,
        leftRef: null,
        rightRef: null,
        topRef: null,
        bottomRef: null,
        zIndex: 9999,
        borderStyle: "solid",
        borderColor: "rgba(255,0,0,1)",
        borderWidth: 1,
        constructor: function (params) {
            this.inherited(arguments);
            declare.safeMixin(this, params);
        },
        mask: function (el) {
            this.el = el;
            domStyle.set(this.domNode, "display", "none");
            //var elPos = geom.getMarginBox(el);//geom.position(el, true);

            var node = el,
                cs = domStyle.getComputedStyle(node),
                mb = geom.getMarginBox(node, cs),
                me = geom.getMarginExtents(node, cs),
                be = geom.getBorderExtents(node, cs),
                elPos = (this._borderBox = {
                    x: mb.l, //- be.w,
                    y: mb.t, //- be.h,
                    w: mb.w,
                    h: mb.h
                });
            debugger;
            domStyle.set(this.leftRef, {
                left: (elPos.x - this.borderWidth) + "px",
                top: elPos.y + "px",
                height: (elPos.h + this.borderWidth) + "px"
            });
            domStyle.set(this.rightRef, {
                left: (elPos.w + elPos.x ) + "px",
                top: (elPos.y - this.borderWidth) + "px",
                height: (elPos.h + this.borderWidth) + "px"
            });
            domStyle.set(this.topRef, {
                left: (elPos.x - this.borderWidth) + "px",
                top: (elPos.y - this.borderWidth) + "px",
                width: (elPos.w + this.borderWidth ) + "px"
            });
            domStyle.set(this.bottomRef, {
                left: elPos.x + "px",
                top: (elPos.y + elPos.h ) + "px",
                width: (elPos.w + this.borderWidth ) + "px"
            });

            domStyle.set(this.domNode, "display", "block");
        },
        unmask: function () {
            this.el = null;
            domStyle.set(this.domNode, "display", "none");
        },
        _getBorderColorAttr: function () {
            return this._get("borderColor");
        },
        _setBorderColorAttr: function (borderColor) {
            this._set("borderColor", borderColor);
            domStyle.set(this.leftRef, "borderLeftColor", this.borderColor);
            domStyle.set(this.rightRef, "borderRightColor", this.borderColor);
            domStyle.set(this.topRef, "borderTopColor", this.borderColor);
            domStyle.set(this.bottomRef, "borderBottomColor", this.borderColor);

        },
        destroy: function () {
            this.inherited(arguments);
            delete this.el;
            delete this.leftRef;
            delete this.rightRef;
            delete this.topRef;
            delete this.bottomRef;
        }
    });
});