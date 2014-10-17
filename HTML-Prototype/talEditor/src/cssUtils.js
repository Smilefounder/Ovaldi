/**
 * Created by Raoh on 2014/10/11.
 */
define([], function () {
    return {
        getRules: function (el, styleSheets) {
            var ret = [], sheets = [], rules, rule;
            if (el.nodeType == 1) {
                if (styleSheets) {
                    sheets = styleSheets;
                } else if (el.ownerDocument) {
                    sheets = el.ownerDocument.styleSheets;
                }
                for (var i = 0, j = sheets.length; i < j; i++) {
                    rules = sheets[i].rules;
                    for (var k = 0, l = rules.length; k < l; k++) {
                        rule = rules[k];
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
        }
    };
});
