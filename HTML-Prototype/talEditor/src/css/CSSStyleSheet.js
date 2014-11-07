/**
 * Created by Raoh on 2014/11/4.
 */
define([
    "dojo/on",
    "dojo/string",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/_base/declare",
    "./CSSStyleRule",
    "tal/Model",
    "tal/cssUtils"
], function (on, string, lang, array, declare, CSSStyleRule, Model, cssUtils) {
    var splice = [].splice;

    return declare([Model], {
        rawText: null,
        href: null,
        cssRules: null,
        nativeSheet: null,
        constructor: function () {
            this.cssRules = [];
            this._started = true;
        },
        checkError: function () {
            //TODO:check text format
        },
        insertRule: function (rule, index) {
            var idx = index || 0;
            rule.parentStyleSheet = this;
            splice.apply(this.cssRules, [idx, 0, rule]);
            cssUtils.insertRule(this.nativeSheet, rule.toString(), index);
            return idx;
        },
        deleteRule: function (index) {
            var rule = this.cssRules[index];
            splice.apply(this.cssRules, [index, 1]);
            rule.destroy();
            cssUtils.deleteRule(this.nativeSheet, index);
        },
        toString: function () {
            var html = [], i = 0, rules = this.cssRules, rule;
            while (rule = rules[i++]) {
                html.push(rule.toString());
            }
            return html.join('');
        },
        _clearRules: function () {
            var rules = this.cssRules, rule;
            while (rule = rules.pop()) {
                rule.destroy();
            }
        },
        destroy: function () {
            this._clearRules();
            this.inherited(arguments);
        }
    });
});
