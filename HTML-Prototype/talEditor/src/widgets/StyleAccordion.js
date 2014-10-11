/**
 * Created by Raoh on 2014/10/10.
 */
define([
    "dojo/_base/declare",
    "dojo/dom-style",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "./_DialogMixin",
    "dojo/text!./templates/StyleAccordion.html"
], function (declare, domStyle, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _DialogMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _DialogMixin], {
        baseClass: "kb-style-accordion",
        templateString: template,
        el: null,
        position: null,
        background: null,
        border: null,
        corner: null,
        shadow: null,
        font: null,
        buildRendering: function () {
            this.inherited(arguments);
            $(this.containerNode).accordion({
                heightStyle: 'content'
            })
        },
        _setElAttr: function (el) {
            this._set("el", el);
            this._setPosition();
            this._setBackground();
            this._setBorder();
            this._setCorner();
            this._setShadow();
            this._setFont();
        },
        _setPosition:function(){
            //TODO:position
        },
        _setBackground: function () {
            var cs = domStyle.getComputedStyle(this.el);
            this.background.css({
                "background-image": cs["background-image"],
                "background-repeat": cs["background-repeat"],
                "background-position-x": cs["background-position-x"],
                "background-position-y": cs["background-position-y"],
                "background-color": cs["background-color"]
            });
        },
        _setBorder: function () {
            var cs = domStyle.getComputedStyle(this.el);
            this.border.css({
                "border-width": cs["border-width"],
                "border-style": cs["border-style"],
                "border-color": cs["border-color"]
            });
        },
        _setCorner: function () {
            var cs = domStyle.getComputedStyle(this.el);
            this.corner.css({
                "border-top-left-radius": cs["border-top-left-radius"],
                "border-top-right-radius": cs["border-top-right-radius"],
                "border-bottom-left-radius": cs["border-bottom-left-radius"],
                "border-bottom-right-radius": cs["border-bottom-right-radius"]
            });
        },
        _setShadow: function () {
            //TODO:shadow
        },
        _setFont: function () {
            var cs = domStyle.getComputedStyle(this.el);
            this.font.css({
                "font-family": cs["font-family"],
                "font-size": cs["font-size"],
                "font-color": cs["font-color"]
            });
        }
    });
});
