/**
 * Created by Raoh on 2014/11/6.
 */
define([
    "dojo/string",
    "dojo/_base/lang",
    "dojo/_base/array",
    "./CSSStyleSheet",
    "./CSSStyleRule",
    "tal/cssUtils"
], function (string, lang, array, CSSStyleSheet, CSSStyleRule, cssUtils) {
    var ruleRE = /(\s*[^{}]+\s*{[^{}]*)*?}/g,
        selectorRE = /^(\s*[^{}]+\s*){([^{}]*)}$/,
        lineRE = /(?:[^;\(]*(?:\([^\)]*?\))?[^;\(]*)*;?/g,
        propRE = /\s*([^:\s]*)\s*:\s*(.*?)\s*(!important)?\s*;?$/;
    return {
        /*
         * 1.解析普通CSS
         * 2.解析Media Rule
         * 3.解析@font-face以及@keyframes
         * */
        parse: function (text) {
            //TODO:处理注释内容
            var self = this, sheet = new CSSStyleSheet(), noComment = cssUtils.noComment(text), m = noComment.match(ruleRE), rules = sheet.cssRules;
            if (m) {
                array.forEach(m, function (it) {
                    //暂时只解析CSSStyleRule
                    var rule = self.parseStyleRule(it);
                    rule.parentStyleSheet = sheet;
                    rules.push(rule);
                });
            }
            sheet.rawText = text;
            return sheet;
        },
        parseStyleRule: function (text) {
            var rule = new CSSStyleRule(), noCommentText = cssUtils.noComment(text),
                ret = [], sm = selectorRE.exec(noCommentText), lines, line, i = 0, pm, propsText;
            if (sm) {
                rule.selectorText = sm[1];
                propsText = sm[2];
                if (propsText) {
                    lines = propsText.match(lineRE);
                    while (line = lines[i++]) {
                        pm = propRE.exec(line);
                        if (pm) {
                            ret.push({
                                name: string.trim(pm[1]),
                                value: string.trim(pm[2]),
                                important: pm[3] ? pm[3] : '',
                                disable: false
                            });
                        }
                    }
                }
            } else {
                throw new Error("CSSStyleRule format error:" + text);
            }
            rule.rawText = text;
            rule.props = ret;
            return rule;
        },
        parseMediaRule: function (text) {
            //TODO:parse CSSMediaRule
        }
    };
});
