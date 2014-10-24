/**
 * Created by Raoh on 2014/10/24.
 */
define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/CssEditor.html",
    "tal/cssUtils",
    "underscore"
], function (declare, _WidgetBase, _TemplatedMixin, template, cssUtils, _) {
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-css-editor",
        templateString: template,
        rules: null,
        rulesNode: null,
        ruleTmpl: null,
        postCreate: function () {
            this.inherited(arguments);
            if (!this._ruleTemplate) {
                this._ruleTemplate = _.template(this.ruleTmpl.innerHTML);
            }
        },
        view: function (el) {
            this.rules = cssUtils.getRules(el);
            this.rulesNode.innerHTML = this._render(this.rules);
        },
        _render: function (rules) {
            var html = '',
                utils = {
                    getSource: function (rule) {
                        return (rule.parentStyleSheet.href || rule.parentStyleSheet.ownerNode.ownerDocument.URL).split('/').reverse()[0];
                    }
                };
            for (var i = 0, j = rules.length; i < j; i++) {
                html += this._ruleTemplate({
                    rule: rules[i],
                    utils: utils
                });
            }
            return html;
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.rules;
            delete this.rulesNode;
            delete this.ruleTmpl;
        }
    });
});
