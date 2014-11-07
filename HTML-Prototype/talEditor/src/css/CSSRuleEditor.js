/**
 * Created by Raoh on 2014/11/1.
 */
define([
    "dojo/on",
    "dojo/keys",
    "dojo/query",
    "dojo/string",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "dojo/_base/window",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/CSSRuleEditor.html",
    "tal/cssUtils",
    "tal/domUtils",
    "underscore"
], function (on, keys, query, string, domAttr, domClass, domConst, lang, win, declare, _WidgetBase, _TemplatedMixin, template, cssUtils, domUtils, _) {
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-css-rule-editor",
        templateString: template,
        rule: null,
        propTmplNode: null,
        selectorNode: null,
        propListNode: null,
        sourceNode: null,
        constructor: function () {
            this._handlers = [];
        },
        postCreate: function () {
            this.inherited(arguments);
            var dom = this.domNode, self = this;
            this.own(on(dom, ".css-selector:click", function (e) {
                var el = e.target;
                if (!el.isContentEditable) {
                    self._editSelector(el);
                }
            }));
            this.own(on(dom, ".css-property-name:click", function (e) {
                var el = e.target;
                if (!el.isContentEditable) {
                    self._editPropName(el);
                }
            }));
            this.own(on(dom, ".css-property-value:click", function (e) {
                var el = e.target;
                if (!el.isContentEditable) {
                    self._editPropValue(el);
                }
            }));
        },
        _setRuleAttr: function (newRule) {
            this._set("rule", newRule);
            this.selectorNode.textContent = newRule.selectorText;
            this.sourceNode.textContent = this.getRuleSource(newRule);
            this.renderProps();
        },
        _addProp: function () {
            this._addingProp = true;
            var html = this._renderProp({name: '', value: '', important: ''}),
                dom = domConst.toDom(html),
                propNameEl = query(".css-property-name", dom)[0];
            domConst.place(dom, this.propListNode);
            this._editPropName(propNameEl);
        },
        renderProps: function () {
            var props = this.rule.props, html = '', prop;
            for (var i = 0, j = props.length; i < j; i++) {
                prop = props[i];
                html += this._renderProp({
                    name: prop.name,
                    value: prop.value,
                    important: prop.important ? ' !important' : ''
                });
            }
            this.propListNode.innerHTML = html;
        },
        _renderProp: function (prop) {
            if (!this._propTemplate) {
                this._propTemplate = _.template(this.propTmplNode.innerHTML);
            }
            return this._propTemplate(prop);
        },
        _beginEditing: function (el) {
            domAttr.set(el, "contenteditable", "true");
            el.focus();
            domUtils.select(el);
        },
        _endEditing: function (el) {
            this._clearHandlers();
            domAttr.set(el, "contenteditable", "false");
            el.textContent = string.trim(el.textContent);
            domUtils.unselect();
        },
        _edit: function (el) {
            if (domClass.contains(el, "css-property-name")) {
                this._editPropName(el);
            }
            else if (domClass.contains(el, "css-property-value")) {
                this._editPropValue(el);
            }
            else if (domClass.contains(el, "add-css-property")) {
                this._addProp();
            }
        },
        _editSelector: function (el) {
            var origSelector = el.textContent;
            this._beginEditing(el);
            this._handlers = this._handlers.concat([
                on(el, "blur", lang.hitch(this, function () {
                    this._endEditing(el);
                    this._saveSelector(el, origSelector);
                })),
                on(el, "keypress", lang.hitch(this, function (e) {
                        if (e.keyCode == keys.ENTER) {
                            e.preventDefault();
                            this._endEditing(el);
                            this._saveSelector(el, origSelector);
                        }
                    }
                )),
                on(el, "paste", this._onPaste)
            ]);
        },
        _saveSelector: function (el, previousValue) {
            var selector = string.trim(el.textContent),
                rule = this.rule,
                src = rule.parentRule || rule.parentStyleSheet,
                ruleIndex = rule.getRuleIndex();

            if (!selector) {
                src.deleteRule(ruleIndex);
                return "";
            }
            if (cssUtils.isValidSelector(selector)) {
                if (previousValue != selector) {
                    rule.setSelectorText(selector);
                }
                return selector;
            } else {
                this.selectorNode.textContent = previousValue;
                return previousValue;
            }
        },
        _editPropName: function (el) {
            var origPropName = el.textContent;
            this._beginEditing(el);
            this._handlers = this._handlers.concat([
                on(el, "blur", lang.hitch(this, function () {
                    this._addingProp = false;
                    this._endEditing(el);
                    var ret = this._savePropName(el, origPropName);
                    if (!ret) {
                        this._removeGroup(el);
                    }
                })),
                on(el, "keypress", lang.hitch(this, function (e) {
                        if (e.keyCode == keys.ENTER) {
                            e.preventDefault();
                            this._endEditing(el);
                            var next = domUtils.findNext(el, function (it) {
                                return domClass.contains(it, "editable");
                            });

                            if (el.textContent) {
                                this._savePropName(el, origPropName);
                            }
                            else {
                                next = domUtils.findNext(next, function (it) {
                                    return domClass.contains(it, "editable");
                                });
                                if (this._addingProp && domClass.contains(next, "add-css-property")) {
                                    next = null;
                                    this._addingProp = false;
                                }
                                this._removeGroup(el);
                            }
                            next && this._edit(next);
                        }
                    }
                )),
                on(el, "parse", this._onPaste)
            ]);
        },
        _removeGroup: function (el) {
            query(el).parents(".css-property-group").remove();
        },
        _checkProperty: function (el) {
            //TODO:检查property状态，对未知属性和覆盖属性加横线标识
        },
        _savePropName: function (el, previousPropName) {
            var propName = string.trim(el.textContent),
                propValue = string.trim(this._getPropValue(el)),
                propIndex = this._getPropIndex(el),
                rule = this.rule,
                parseValue;

            if (propName) {
                if (propName != previousPropName && propValue) {
                    parseValue = this.parsePriority(propValue);
                    rule.setProperty(propIndex, propName, parseValue.value, parseValue.priority);
                }
            } else if (previousPropName) {
                rule.removeProperty(propIndex);
            }
            return propName && propValue;
        },
        _getPropIndex: function (el) {
            var group = query(el).parents(".css-property-group")[0], groups = query(".css-property-group", this.propListNode);
            return groups.indexOf(group);
        },
        _editPropValue: function (el) {
            var origPropValue = el.textContent;
            this._beginEditing(el);
            this._handlers = this._handlers.concat([
                on(el, "blur", lang.hitch(this, function () {
                    this._addingProp = false;
                    this._endEditing(el);
                    var ret = this._savePropValue(el, origPropValue);
                    if (!ret) {
                        this._removeGroup(el);
                    }
                })),
                on(el, "keypress", lang.hitch(this, function (e) {
                        if (e.keyCode == keys.ENTER) {
                            e.preventDefault();
                            this._endEditing(el);
                            var next = domUtils.findNext(el, function (it) {
                                return domClass.contains(it, "editable");
                            });
                            var ret = this._savePropValue(el, origPropValue);
                            if (!ret) {
                                this._removeGroup(el);
                                if (this._addingProp && domClass.contains(next, "add-css-property")) {
                                    next = null;
                                    this._addingProp = false;
                                }
                            }
                            next && this._edit(next);
                        }
                    }
                )),
                on(el, "parse", this._onPaste)
            ]);
        },
        _savePropValue: function (el, previousPropValue) {
            var propValue = string.trim(el.textContent),
                propName = string.trim(this._getPropName(el)),
                propIndex = this._getPropIndex(el),
                rule = this.rule,
                parseValue;

            if (propValue) {
                if (propValue != previousPropValue) {
                    parseValue = this.parsePriority(propValue);
                    rule.setProperty(propIndex, propName, parseValue.value, parseValue.priority);
                }
            } else if (previousPropValue) {
                rule.removeProperty(propIndex);
            }
            return propName && propValue;
        },
        _getPropName: function (node) {
            var el = query(node).prevAll(".css-property-name")[0];
            return el ? el.textContent : null;
        },
        _getPropValue: function (node) {
            var el = query(node).nextAll(".css-property-value")[0];
            return el ? el.textContent : null;
        },
        parseCSSProps: function (style) {
            var parts = style.cssText.split(';'),
                ret = [], pair;

            for (var i = 0, j = parts.length; i < j; i++) {
                pair = parts[i].split(':');
                if (pair.length == 2) {
                    ret.push({
                        name: string.trim(pair[0]),
                        value: string.trim(pair[1]),
                        important: style.getPropertyPriority(pair[0]) ? " !important" : ""
                    });
                }
            }
            return ret;
        },
        getRuleSource: function (rule) {
            return (rule.parentStyleSheet.href || '').split('/').reverse()[0];
        },
        _clearHandlers: function () {
            var h;
            while (h = this._handlers.pop()) {
                h.remove();
            }
        },
        parsePriority: function (value) {
            var rePriority = /(.*?)\s*(!important)?$/;
            var m = rePriority.exec(value);
            var propValue = m ? m[1] : "";
            var priority = m && m[2] ? "!important" : "";
            return {value: propValue, priority: priority};
        },
        _onPaste: function (e) {
            debugger;
            e.preventDefault();
            var w = win.global, doc = win.doc,
                clip = (e.originalEvent || e).clipboardData, text;
            if (clip) {
                text = clip.getData("text/plain");
            }
            else {
                text = w.clipboardData.getData("text");
            }

            if (w.getSelection) {
                var sel = w.getSelection(),
                    range = sel.getRangeAt(0),
                    node = doc.createTextNode(text);
                range.deleteContents();
                range.insertNode(node);
                node.parentNode.normalize();
                range.setStart(node, node.length);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        },
        _onAddProp: function () {
            this._addProp();
        },
        onChange: function (oldCssText, newCssText) {
        },
        onSelectorChange: function (oldSelector, newSelector) {
        },
        destroy: function () {
            this._clearHandlers();
            this.inherited(arguments);
            delete this.rule;
            delete this.propListNode;
            delete this.propTmplNode;
            delete this.selectorNode;
            delete this.sourceNode;
            delete this._handlers;
        }
    });
});
