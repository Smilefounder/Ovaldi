/**
 * Created by Raoh on 2014/10/29.
 */
define([
    "dojo/on",
    "dojo/keys",
    "dojo/_base/lang",
    "dojo/_base/declare",
    //"dijit/Destroyable",
    "dijit/_WidgetBase",
    "dojo/dom-class",
    "dojo/dom-attr",
    "tal/domUtils"
], function (on, keys,lang, declare, _WidgetBase, domClass, domAttr, domUtils) {
    return declare([_WidgetBase], {
        panel: null,
        origText: null,
        constructor: function (params) {
            this.domNode = params.el||params.domNode;
            this.panel = params.panel;
            this.origText = this.domNode.textContent;
        },
        postCreate: function () {
            var el = this.domNode;
            this.own(
                on(el, "blur", lang.hitch(this, function () {
                    this.saveEdit();
                    this.destroy(true);
                })),
                on(el, "keypress", lang.hitch(this, function (e) {
                    if (e.keyCode == keys.ENTER) {
                        e.preventDefault();
                        this.saveEdit(true);
                        this.destroy(true);
                    }
                })),
                on(el, "paste", lang.hitch(this, function (e) {
                    e.preventDefault();
                    var clip = (e.originalEvent || e).clipboardData, text;
                    if (clip) {
                        text = clip.getData("text/plain");
                    }
                    else {
                        text = window.clipboardData.getData("text");
                    }
                    var sel = window.getSelection(),
                        range = sel.getRangeAt(0),
                        node = document.createTextNode(text);
                    range.deleteContents();
                    range.insertNode(node);
                    node.parentNode.normalize();
                    range.setStart(node, node.length);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }))
            );
        },
        edit: function () {
            var el = this.domNode;
            domAttr.set(el, "contenteditable", "true");
            el.focus();
            domUtils.select(el);
        },
        saveEdit: function (advance) {
            if(advance){

            }
            return true;
        },
        destroy: function () {
            domAttr.set(this.domNode, "contenteditable", "false");
            this.inherited(arguments);
            delete this.panel;
        }
    });
});
