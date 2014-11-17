/**
 * Created by Raoh on 2014/11/4.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/string",
    "tal/Model",
    "tal/cssUtils"
], function (declare, array, string, Model, cssUtils) {
    var splice = [].splice;

    return declare([Model], {
        rawText: null,
        selectors: null,
        selectorText: null,
        parentRule: null,
        parentStyleSheet: null,
        props: null,//[{name:'display',value:'none',priority:'!important'}]
        constructor: function () {
            this.selector = [];
            this._started = true;
        },
        getProperty: function (index) {
            return this.props[index];
        },
        setProperty: function (index, propName, propValue, important) {
            var prop = this.getProperty(index), existed = !!prop, prop = prop || {};
            prop.name = propName;
            prop.value = propValue;
            prop.important = !!important;
            if (!existed) {
                splice.apply(this.props, [ index, 0, prop]);
            }
            this._onChange();
            return prop;
        },
        removeProperty: function (index) {
            var prop = this.props[index];
            if (prop) {
                splice.apply(this.props, [index, 1]);
                this._onChange();
                return prop;
            }
        },
        _onChange: function () {
            var src = this.parentRule || this.parentStyleSheet,
                nativeSrc = src.nativeParentRule || src.nativeSheet;
            if (nativeSrc) {
                var ruleIndex = this.getRuleIndex(),
                    cssText = this.toString();
                cssUtils.deleteRule(nativeSrc, ruleIndex);
                cssUtils.insertRule(nativeSrc, cssText, ruleIndex);
            }
        },
        setSelectorText: function (newSelectorText) {
            this.selectorText = newSelectorText;
            this.selector = this.selectorText.split(',');
            this._onChange();
        },
        getRuleIndex: function () {
            var idx = 0,
                sheet = this.parentRule || this.parentStyleSheet,
                rules = sheet.cssRules,
                len = rules.length;
            while (idx < len && this != rules[idx]) {
                idx++;
            }
            return idx;
        },
        toString: function () {
            var html = [this.selectorText, "{"];
            html.push(this.propString());
            html.push("}");
            return html.join('');
        },
        propString: function () {
            var html = [];
            array.forEach(this.props, function (it) {
                html.push(it.name);
                html.push(':');
                html.push(it.value);
                html.push(it.important ? (' ' + it.important) : '');
                html.push(';')
            });
            return html.join('');
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.props;
        }
    });
});