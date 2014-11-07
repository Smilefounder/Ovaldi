/**
 * Created by Raoh on 2014/10/24.
 */
define([
    "dojo/on",
    "dojo/keys",
    "dojo/query",
    "dojo/string",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/_base/window",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_Container",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/CSSPanel.html",
    "./CSSRuleEditor",
    "tal/cssUtils",
    "tal/domUtils",
    "tal/utils",
    "underscore"
], function (on, keys, query, string, domAttr, domClass, domConst, win, array, lang, declare, _WidgetBase, _Container, _TemplatedMixin, template, CSSRuleEditor, cssUtils, domUtils, utils, _) {

    return declare([_WidgetBase, _Container, _TemplatedMixin], {
        baseClass: "kb-css-panel",
        templateString: template,
        el: null,
        styleSheets: null,
        constructor: function () {
            this.styleSheets = [];
        },
        setStyleSheets: function (styleSheets) {
            this.styleSheets = styleSheets;
            this.el && this.view(this.el);
        },
        view: function (el) {
            this.el = el;
            this._removeAllChild();
            var rules = this._getCSSRules(el), child;
            for (var i = 0, j = rules.length; i < j; i++) {
                child = new CSSRuleEditor({
                    rule: rules[i]
                });
                this.addChild(child);
            }
        },
        _getCSSRules: function (el) {
            var styleSheets = this.styleSheets, ret = [], rules, rule;
            //按浏览器加载次序，后加载覆盖前加载
            for (var i = styleSheets.length - 1; i >= 0; i--) {
                rules = styleSheets[i].cssRules;
                for (var l = rules.length - 1; l >= 0; l--) {
                    rule = rules[l];
                    if (cssUtils.isValidSelector(rule.selectorText) && cssUtils.matchesSelector(el, rule.selectorText)) {
                        ret.push(rule);
                    }
                }
            }

            //TODO:sort rules by selector

            return ret;
        },
        _sortSelectors: function (rules) {
            var arr = [], rule, selector, a, b, c, m;

            for (var i = 0, j = selectors.length; i < j; i++) {
                rule = rules[i];
                selector = rule.selectorText;

                var idReg = /#\S+/g,//ID选择符
                    classReg = /\.\S+/g,//类选择符
                    attributeReg = /[\[\S+\]]/,//属性选择符
                    pseudoElementsReg = /:after|:before|:first-letter|:first-line|:selection/g,//伪元素选择符
                    pseudoClasses;//伪类选择符

                m = selector.match(idReg);
                a = m ? m.length : 0;
                m = selector.match(classReg);
                b = m ? m.length : 0;
                m = selector.match(attributeReg);
                b = m ? b + m.length : b;
                //统计伪类选择器
                m = selector.match(pseudoElementsReg);
                b = m ? b + m.length : b;
                //统计元素选择器
                c = selector.replace(/(#\S+)|(\.\S+)|(\[\S+\])|(\+|~|>|\*)|(:\S+)|(::\S+)/g, ' ').trim().replace(/\s+/g, ',').split(',').length;
                //统计:伪元素选择器
                //c+=
                arr.push({
                    rule: rule,
                    weight: parseInt([a, b, c].join(''))
                });
            }
            arr.sort(function (a, b) {
                return a.weight < b.weight;
            });

            return array.map(arr, function (it) {
                return it.rule;
            });
        },
        _removeAllChild: function () {
            var childs = this.getChildren();
            array.forEach(childs, lang.hitch(this, function (child) {
                this.removeChild(child);
            }));
        },
        onChange: function (index, oldCssText, newCssText) {
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.el;
        }
    });
});
