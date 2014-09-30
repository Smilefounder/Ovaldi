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
        borderWidth: 2,
        constructor: function (params) {
            this.inherited(arguments);
            declare.safeMixin(this, params);
        },
        mask: function (el) {
            this.el = el;
            domStyle.set(this.domNode, "display", "none");

            var
                elPos = geom.position(el, true), doc = el.ownerDocument,
                winWidth = Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth),
                winHeight = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);

            domStyle.set(this.leftRef, {
                left: elPos.x + "px",
                top: elPos.y + "px",
                height: elPos.h + "px"
            });
            domStyle.set(this.rightRef, {
                left: (elPos.w + elPos.x - this.borderWidth) + "px",//必须减去div的宽度，防止出现X轴滚动条
                top: elPos.y + "px",
                height: elPos.h + "px"
            });
            domStyle.set(this.topRef, {
                left: (elPos.x + this.borderWidth)  + "px",
                top: elPos.y + "px",
                width: (elPos.w - this.borderWidth) + "px"
            });
            domStyle.set(this.bottomRef, {
                left: (elPos.x + this.borderWidth) + "px",
                top: (elPos.y + elPos.h - this.borderWidth) + "px",//必须减去div的宽度，防止出现Y轴滚动条
                width: (elPos.w - this.borderWidth) + "px"
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