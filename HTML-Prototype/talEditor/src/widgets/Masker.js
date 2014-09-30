/**
 * Created by Raoh on 2014/8/12.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/Masker.html",
    "./ko"
], function (declare, lang, aspect, domStyle, geom, _WidgetBase, _TemplatedMixin, template, ko) {

    var Masker = declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-masker",
        templateString: template,
        el: null,
        leftRef: null,
        rightRef: null,
        topRef: null,
        bottomRef: null,
        cursor: "not-allowed",
        zIndex: 9999,
        bgColor: "rgba(0,0,0,0.2)",
        constructor: function (params) {
            this.inherited(arguments);
            declare.safeMixin(this, params);
        },
        startup: function () {
            this.el && this.mask(this.el);
        },
        mask: function (el) {
            this.el = el;
            //当窗体由大变小时，4个maskDiv的占位可能导致窗体出现滚动条
            //消除4个maskDiv的占位，以获取正确的window宽高
            domStyle.set(this.domNode, "display", "none");

            var
                elPos = geom.position(el, true), doc = el.ownerDocument,
                winWidth = Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth),
                winHeight = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);

            domStyle.set(this.leftRef, {
                left: "0px",
                top: "0px",
                width: elPos.x + "px",
                height: (elPos.y + elPos.h) + "px"
            });
            domStyle.set(this.rightRef, {
                left: (elPos.w + elPos.x) + "px",
                top: elPos.y + "px",
                width: (winWidth - elPos.x - elPos.w) + "px",
                height: (winHeight - elPos.y) + "px"
            });
            domStyle.set(this.topRef, {
                left: elPos.x + "px",
                top: "0px",
                width: (winWidth - elPos.x) + "px",
                height: elPos.y + "px"
            });
            domStyle.set(this.bottomRef, {
                left: "0px",
                top: (elPos.y + elPos.h) + "px",
                width: (elPos.x + elPos.w) + "px",
                height: (winHeight - elPos.y - elPos.h) + "px"
            });

            domStyle.set(this.domNode, "display", "block");
        },
        resize: function () {
            domStyle.set(this.domNode, "display", "none");
            this.mask(this.el);
        },
        unmask: function () {
            this.set("el", null);
            domStyle.set(this.domNode, "display", "none");
        },
        _getBgColorAttr: function () {
            return this._get("bgColor");
        },
        _setBgColorAttr: function (val) {
            this._set("bgColor", val);
            domStyle.set(this.leftRef, "backgroundColor", this.bgColor);
            domStyle.set(this.rightRef, "backgroundColor", this.bgColor);
            domStyle.set(this.topRef, "backgroundColor", this.bgColor);
            domStyle.set(this.bottomRef, "backgroundColor", this.bgColor);

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

    return Masker;
});