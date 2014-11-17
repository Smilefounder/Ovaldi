/**
 * Created by Raoh on 2014/10/11.
 */
define([
    "dojo/_base/window",
    "dojo/_base/array"
], function (win, array) {
    var commentRE = /\/\*[\w\W]*?\*\//ig;
    return {
        getRulesByElement: function (el, styleSheets) {
            var ret = [], sheets = [], rules, rule;
            if (el.nodeType == 1) {
                if (styleSheets) {
                    sheets = styleSheets;
                } else if (el.ownerDocument) {
                    sheets = el.ownerDocument.styleSheets;
                }
                for (var i = sheets.length - 1; i >= 0; i--) {
                    rules = sheets[i].cssRules || sheets[i].rules;
                    for (var l = rules.length - 1; l >= 0; l--) {
                        rule = rules[l];
                        if (this.matchesSelector(el, rule.selectorText)) {
                            ret.push(rule);
                        }
                    }
                }
            }
            return ret;
        },
        matchesSelector: function (el, selector) {
            //如需支持低版本IE，可引入Sizzle支持
            var matchesSelector = el.matchesSelector || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
            if (matchesSelector) {
                return matchesSelector.call(el, selector);
            }
            return false;
        },
        distinct: function (css1, css2) {
            var ret = {};
            for (var p in css1) {
                if (css1[p] != css2[p]) {
                    ret[p] = css1[p];
                }
            }
            return ret;
        },
        isValidSelector: function (value) {
            try {
                win.doc.querySelector(value);
                return true;
            }
            catch (e) {
                return false;
            }
        },
        isSupports: function (prop, value) {
            var g = win.global;
            return g.CSS && g.CSS.supports(prop, value);
        },
        setProperty: function (rule, propName, propValue, priorty) {
            var style = rule.style || rule;
            style.removeProperty(propName);//当priorty已存在时，无法改变它，只能通过先移除再添加
            style.setProperty(propName, propValue, priorty);
        },
        removeProperty: function (rule, propName) {
            var style = rule.style || rule;
            style.removeProperty(propName);
        },
        getRule: function (styleSheet, ruleIndex) {
            var rules = styleSheet.cssRules || styleSheet.rules;
            return rules[ruleIndex];
        },
        insertRule: function (src, cssText, ruleIndex) {
            var insertIndex = src.insertRule(cssText, ruleIndex || 0);
            return insertIndex;
        },
        deleteRule: function (src, ruleIndex) {
            if (src.deleteRule) {
                src.deleteRule(ruleIndex);
            }
            else if (src.removeRule) {
                src.removeRule(ruleIndex);
            }
        },
        getRuleIndex: function (rule) {
            var idx = 0,
                sheet = rule.parentRule || rule.parentStyleSheet,
                rules = sheet.cssRules || sheet.rules,
                len = rules.length;
            while (idx < len && rule != rules[idx]) {
                idx++;
            }
            return idx;
        },
        noComment: function (text) {
            return (text || '').replace(commentRE, '');
        }
    };
});