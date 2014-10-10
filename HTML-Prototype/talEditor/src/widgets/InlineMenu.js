/**
 * Created by Raoh on 2014/9/18.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/string",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/InlineMenu.html",
    "dojo/i18n!./nls/InlineMenu"
], function (declare, array, lang, on, string, domStyle, domClass, domAttr, domConst, domGeom, _WidgetBase, _TemplatedMixin, template, res) {
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-inline-menu",
        templateString: template,
        title: "Menu",
        zIndex: 9999,
        menus: [],
        menusNode: null,
        constructor: function (params) {
            declare.safeMixin(this, params);
        },
        postMixInProperties: function () {
            lang.mixin(this, res);
            this.inherited(arguments);
        },
        postCreate: function () {
            this.inherited(arguments);
            var menus = this.menus;
            for (var i = 0 , j = menus.length; i < j; i++) {
                this._renderMenu(menus[i]);
            }
        },
        addMenu: function (m) {
            this.menus.push(m);
            this._renderMenu(m);
        },
        refresh: function () {
            var menus = this.menus, menu;
            for (var i = 0, j = menus.length; i < j; i++) {
                menu = menus[i];
                var visibility = menu.visibility;
                if (lang.isFunction(menu.visibility)) {
                    visibility = menu.visibility.apply(this, [menu]);
                }
                domStyle.set(menu.dom, "display", visibility ? "block" : "none");
            }
        },
        _renderMenu: function (menu) {
            menu.dom = domConst.toDom(string.substitute('<li><a href="javascript:;">${0}</a></li>', [menu.text]));
            this.own(on(menu.dom, "click", lang.hitch(this, function () {
                menu.callback && menu.callback.apply(this, [menu]);
            })));
            var visibility = menu.visibility;
            if (lang.isFunction(menu.visibility)) {
                visibility = menu.visibility.apply(this, [menu]);
            }
            domStyle.set(menu.dom, "display", visibility ? "block" : "none");
            domConst.place(menu.dom, this.menusNode);
        },
        show: function (x, y) {
            domStyle.set(this.domNode, {
                left: x + "px",
                top: y + "px"
            });
        },
        hide: function () {
            domStyle.set(this.domNode, "left", "-1000px");
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.menusNode;
        }
    });
});