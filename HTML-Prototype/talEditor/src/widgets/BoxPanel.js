define([
    "dojo/on",
    "dojo/query",
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dojo/dom-style",
    "dojo/dom-class",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/BoxPanel.html"
], function (on, query, lang, declare, domStyle, domClass, _WidgetBase, _TemplatedMixin, template) {
    function toFloat(str) {
        return parseFloat(str) || 0;
    }

    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-box-panel",
        templateString: template,
        positionNode: null,
        zIndexNode: null,
        positionBox: null,

        positionTop: null,
        positionRight: null,
        positionBottom: null,
        positionLeft: null,

        contentWidth: null,
        contentHeight: null,

        marginTop: null,
        marginRight: null,
        marginBottom: null,
        marginLeft: null,

        borderTop: null,
        borderRight: null,
        borderBottom: null,
        borderLeft: null,

        paddingTop: null,
        paddingRight: null,
        paddingBottom: null,
        paddingLeft: null,
        startup: function () {
            this.inherited(arguments);
            this.own([
                on(this.domNode, "input:paste", lang.hitch(this, function (e) {
                    var self = this, el = e.target;
                    setTimeout(function () {
                        el.value = toFloat(el.value);
                        self._onChange();
                    }, 0);
                })),
                on(this.domNode, "input:focusout", lang.hitch(this, function (e) {
                    var el = e.target;
                    el.value = toFloat(el.value);
                    this._onChange();
                }))
            ]);
        },
        css: function (css) {
            if (css) {
                var position = css["position"], isLayout = position == "absolute" || position == "relative";
                this.__isLayout = isLayout;
                this.positionNode.textContent = position;
                domClass[isLayout ? "add" : "remove"](this.positionBox, "active");
                if (isLayout) {
                    this.positionTop.value = toFloat(css["top"]);
                    this.positionRight.value = toFloat(css["right"]);
                    this.positionBottom.value = toFloat(css["bottom"]);
                    this.positionLeft.value = toFloat(css["left"]);
                }
                //width & height
                this.contentWidth.value = toFloat(css["width"]);
                this.contentHeight.value = toFloat(css["height"]);
                //margin
                this.marginTop.value = toFloat(css["marginTop"]);
                this.marginRight.value = toFloat(css["marginRight"]);
                this.marginBottom.value = toFloat(css["marginBottom"]);
                this.marginLeft.value = toFloat(css["marginLeft"]);
                //border
                this.borderTop.value = toFloat(css["borderTopWidth"]);
                this.borderRight.value = toFloat(css["borderRightWidth"]);
                this.borderBottom.value = toFloat(css["borderBottomWidth"]);
                this.borderLeft.value = toFloat(css["borderLeftWidth"]);
                //padding
                this.paddingTop.value = toFloat(css["paddingTop"]);
                this.paddingRight.value = toFloat(css["paddingRight"]);
                this.paddingBottom.value = toFloat(css["paddingBottom"]);
                this.paddingLeft.value = toFloat(css["paddingLeft"]);
                //z-index
                this.zIndexNode.textContent = css["zIndex"];

            } else {
                var ret = {};
                if (this.__isLayout) {
                    ret["top"] = toFloat(this.positionTop.value) + "px";
                    ret["right"] = toFloat(this.positionRight.value) + "px";
                    ret["bottom"] = toFloat(this.positionBottom.value) + "px";
                    ret["left"] = toFloat(this.positionLeft.value) + "px";
                }
                ret["width"] = toFloat(this.contentWidth.value) + "px";
                ret["height"] = toFloat(this.contentHeight.value) + "px";

                ret["marginTop"] = toFloat(this.marginTop.value) + "px";
                ret["marginRight"] = toFloat(this.marginRight.value) + "px";
                ret["marginBottom"] = toFloat(this.marginBottom.value) + "px";
                ret["marginLeft"] = toFloat(this.marginLeft.value) + "px";

                ret["borderTopWidth"] = toFloat(this.borderTop.value) + "px";
                ret["borderRightWidth"] = toFloat(this.borderRight.value) + "px";
                ret["borderBottomWidth"] = toFloat(this.borderBottom.value) + "px";
                ret["borderLeftWidth"] = toFloat(this.borderLeft.value) + "px";

                ret["paddingTop"] = toFloat(this.paddingTop.value) + "px";
                ret["paddingRight"] = toFloat(this.paddingRight.value) + "px";
                ret["paddingBottom"] = toFloat(this.paddingBottom.value) + "px";
                ret["paddingLeft"] = toFloat(this.paddingLeft.value) + "px";
                return ret;
            }
        },
        reset: function () {
            query("input", this.domNode).forEach(function (el) {
                el.value = "0";
            });
            this._setClass();
        },
        _setClass: function () {
            query("input", this.domNode).forEach(function (el) {
                domClass[el.value == "0" ? "add" : "remove"](el, "null");
            });
        },
        _onChange: function (e) {
            this._setClass();
            this.onChange(this.css());
        },
        onChange: function (css) {
        },
        destroy: function () {
            this.inherited(arguments);
        }
    });
})
