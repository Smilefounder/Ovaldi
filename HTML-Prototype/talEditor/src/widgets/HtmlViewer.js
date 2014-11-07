define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/string",
    "dojo/keys",
    "dojo/query",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/HtmlViewer.html",
    "dojo/i18n!./nls/CodeViewer",
    "underscore",
    "dojo/NodeList-traverse",
    "dojo/NodeList-manipulate"
], function (declare, array, lang, on, string, keys, query, domClass, domAttr, domStyle, domConst, geom, _WidgetBase, _TemplatedMixin, template, res, _) {
    var ix = 1,
        whiteSpaceRegExp = /^\s*$/m,
        voidElementsRegExp = /^area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr$/i;

    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-code-viewer",
        templateString: template,
        skips: ["script", "link"],//tagName or id
        insertAttrTitle: "Insert attribute",
        el: null,
        elemHash: null,
        treeTmpl: null,
        pathTmpl: null,
        treeNode: null,
        pathNode: null,
        uuidKey: "data-kooboo-uuid",
        disabled: false,
        constructor: function (params) {
            declare.safeMixin(this, params);
            this._handlers = [];
        },
        postMixInProperties: function () {
            lang.mixin(this, res);
            this.inherited(arguments);
        },
        startup: function () {
            this.inherited(arguments);
            var self = this;
            //定时释放对DOM的引用，防止内存泄漏
            this._releaseLoop = setTimeout(function loop() {
                self.release();
                this._releaseLoop = setTimeout(loop, 1000);
            }, 1000);
        },
        getUuid: function (el) {
            return el[this.uuidKey];
        },
        generateUuid: function () {
            return ix++;
        },
        isVoidElement: function (el) {
            return voidElementsRegExp.test(el.tagName);
        },
        isEmpty: function (textNode) {
            return textNode.nodeType == 3 && whiteSpaceRegExp.test(textNode.textContent);
        },
        postCreate: function () {
            this.inherited(arguments);
            if (!this._treeTemplate) {
                this._treeTemplate = _.template(this.treeTmpl.innerHTML);
            }

            function edit(el) {
                domAttr.set(el, "contenteditable", "true");
                domClass.add(el, "editing");
                el.focus();
                //TODO:全选
            }

            function unedit(el) {
                domAttr.remove(el, "contenteditable");
                domClass.remove(el, "editing");
            }

            //带空格的attribute name在Chrome下会报错
            function trimAll(str) {
                return str.replace(/\s/g, '');
            }

            //处理折叠事件
            this.own(on(this.treeNode, on.selector(".sprite", "click"), lang.hitch(this, function (e) {
                var uuid = domAttr.get(e.target, this.uuidKey),
                    collapseHandler = query("li[" + this.uuidKey + "='" + uuid + "']", this.treeNode)[0],
                    collapsed = domClass.contains(collapseHandler, "collapsed");

                this[collapsed ? "expand" : "collapse"](uuid);
            })));
            //处理attribute name事件
            this.own(on(this.treeNode, on.selector("span.attr-name", "click"), lang.hitch(this, function (e) {
                var el = e.target,
                    oldAttr = el.textContent,
                    attrEl = el.parentNode,
                    uuid = domAttr.get(el, this.uuidKey),
                    refEl = this.elemHash[uuid],
                    value = refEl.getAttribute(oldAttr);

                edit(el);

                this._handlers = this._handlers.concat([
                    on(el, "blur", lang.hitch(this, function (e) {
                        var newAttr = el.textContent = trimAll(el.textContent);

                        if (newAttr != oldAttr) {
                            refEl.removeAttribute(oldAttr);
                        }
                        if (newAttr) {
                            refEl.setAttribute(newAttr, value);
                        } else {
                            domConst.destroy(attrEl);
                        }
                        unedit(el);
                        this._cleanupHandlers();
                    })),
                    on(el, "keypress", lang.hitch(this, function (e) {
                            var newAttr = el.textContent = trimAll(el.textContent);

                            if (e.keyCode == keys.ENTER || e.charCode == 61/*判断是否按下"="键*/) {
                                e.preventDefault();
                                unedit(el);
                                this._cleanupHandlers();

                                var editables = query(".editable,.add-attr", this.treeNode).filter(function (it) {
                                    return !domClass.contains(it, "node-empty");
                                });

                                if (newAttr != oldAttr) {
                                    refEl.removeAttribute(oldAttr);
                                }
                                if (newAttr) {
                                    refEl.setAttribute(newAttr, value);
                                } else {
                                    domConst.destroy(attrEl);
                                }
                                this._editNext(editables, el);
                            }
                        }
                    ))
                ])
                ;
            })));
            //处理attribute value事件
            this.own(on(this.treeNode, on.selector("span.attr-value", "click"), lang.hitch(this, function (e) {
                var el = e.target,
                    uuid = domAttr.get(el, this.uuidKey),
                    attrName = new query.NodeList(el).prev("span").text(),
                    refEl = this.elemHash[uuid];

                edit(el);
                this._handlers = this._handlers.concat([
                    on(el, "blur", lang.hitch(this, function (e) {
                        refEl.setAttribute(attrName, el.textContent);
                        unedit(el);
                        this._cleanupHandlers();
                    })),
                    on(el, "keypress", lang.hitch(this, function (e) {
                        refEl.setAttribute(attrName, el.textContent);
                        if (e.keyCode == keys.ENTER || e.charCode == 61/*判断是否按下"="键*/) {
                            e.preventDefault();
                            unedit(el);
                            this._cleanupHandlers();

                            var editables = query(".editable,.add-attr", this.treeNode).filter(function (it) {
                                return !domClass.contains(it, "node-empty");
                            });
                            this._editNext(editables, el);
                        }
                    })),
                    on(el, "keyup", lang.hitch(this, function (e) {
                        refEl.setAttribute(attrName, el.textContent);
                    }))
                ]);
            })));
            //处理TextNode事件
            this.own(on(this.treeNode, on.selector("span.node-text", "click"), lang.hitch(this, function (e) {
                var el = e.target,
                    uuid = domAttr.get(el, this.uuidKey),
                    refEl = this.elemHash[uuid];

                edit(el);
                this._handlers = this._handlers.concat([
                    on(el, "blur", lang.hitch(this, function (e) {
                        refEl.textContent = el.textContent;
                        unedit(el);
                        this._cleanupHandlers();
                    })),
                    on(el, "keypress", lang.hitch(this, function (e) {
                        refEl.textContent = el.textContent;
                        if (e.keyCode == keys.ENTER || e.charCode == 61/*判断是否按下"="键*/) {
                            e.preventDefault();
                            unedit(el);
                            this._cleanupHandlers();

                            var editables = query(".editable,.add-attr", this.treeNode).filter(function (it) {
                                return !domClass.contains(it, "node-empty");
                            });
                            this._editNext(editables, el);
                        }
                    })),
                    on(el, "keyup", lang.hitch(this, function (e) {
                        refEl.textContent = el.textContent;
                    }))
                ]);
            })));
            //处理新增attribute事件
            this.own(on(this.treeNode, on.selector(".new-attribute", "click"), lang.hitch(this, function (e) {
                var el = e.target,
                    uuid = domAttr.get(el, this.uuidKey),
                    refEl = this.elemHash[uuid],
                    attrEl = domConst.toDom(string.substitute('<span><span class="attr-name editable" ${0}="${1}">&nbsp;</span>="<span class="attr-value editable" ${0}="${1}">&nbsp;</span>"</span>', [this.uuidKey, uuid])),
                    attrNameEl = query("span", attrEl)[0];

                domConst.place(attrEl, el.parentNode, "before");
                edit(attrNameEl);

                this._handlers = this._handlers.concat([
                    on(attrNameEl, "blur", lang.hitch(this, function (e) {
                        var attr = attrNameEl.textContent = trimAll(attrNameEl.textContent);

                        if (attr) {
                            refEl.setAttribute(attr, "");
                        } else {
                            domConst.destroy(attrEl);
                        }
                        unedit(attrNameEl);
                        this._cleanupHandlers();
                    })),
                    on(attrNameEl, "keypress", lang.hitch(this, function (e) {
                        if (e.keyCode == keys.ENTER || e.charCode == 61/*判断是否按下"="键*/) {
                            e.preventDefault();
                            unedit(attrNameEl);
                            this._cleanupHandlers();

                            var attr = attrNameEl.textContent = trimAll(attrNameEl.textContent);
                            var editables = query(".editable", this.treeNode).filter(function (it) {
                                return !domClass.contains(it, "node-empty");
                            });

                            if (attr) {
                                refEl.setAttribute(attr, "");
                            } else {
                                domConst.destroy(attrEl);
                            }

                            this._editNext(editables, attrNameEl);
                        }
                    }))
                ]);
            })));
        },
        _editNext: function (arr, el) {
            var idx = arr.indexOf(el) || 0;
            for (var i = idx + 1, j = arr.length; i < j; i++) {
                if (this.domNode.contains(arr[i])) {
                    on.emit(arr[i], "click", {bubbles: true});
                    break;
                }
            }
        },
        _setElAttr: function (el) {
            this._set("el", el);
            this._set("elemHash", {});
        },
        view: function (el, skips /*e.g:["#kbContainer","script","link"]*/) {
            if (!this.disabled) {

                this.set("el", el);
                this.set("skips", skips);
                this._renderTree(this.el);
                var uuid = this.getUuid(this.el);
                this.select(uuid);
                this.emit("View", {}, [this.el]);
            }
        },
        onView: function (el) {
        },
        expand: function (uuid) {
            query("li[" + this.uuidKey + "='" + uuid + "']", this.treeNode).removeClass("collapsed");
        },
        collapse: function (uuid) {
            query("li[" + this.uuidKey + "='" + uuid + "']", this.treeNode).addClass("collapsed");
        },
        expandAll: function () {
            query("li", this.treeNode).removeClass("collapsed");
        },
        collapseAll: function () {
            query("li", this.treeNode).addClass("collapsed");
        },
        scrollTo: function (uuid) {
            var li = query("li[" + this.uuidKey + "='" + uuid + "']", this.treeNode)[0];
            if (li) {
                li.scrollIntoView();
            }
        },
        _cleanupHandlers: function () {
            var h;
            while (h = this._handlers.pop()) {
                h.remove();
            }
        },
        _renderTree: function (node, replaceToUuid) {
            console.time("HtmlViewer:_renderTree");
            var self = this;
            var utils = {
                getUuid: function (node) {
                    var uuid = node[self.uuidKey];
                    if (!uuid) {
                        uuid = node[self.uuidKey] = self.generateUuid();
                        self.elemHash[uuid] = node;
                    }
                    return uuid;
                },
                render: function (node) {
                    return self._treeTemplate({
                        node: node,
                        utils: utils
                    });
                },
                isTextOnly: function (node) {
                    return node.nodeType == 3 || !node.firstElementChild;
                },
                isEmpty: function (node) {
                    return node.textContent.trim().length == 0;
                },
                isVoidElement: function (node) {
                    return voidElementsRegExp.test(node.tagName);
                },
                matchesSelector: function (el, selector) {
                    var matchesSelector = el.matchesSelector || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
                    if (matchesSelector) {
                        return matchesSelector.call(el, selector);
                    }
                    return false;
                },
                skip: function (el) {
                    if (el.nodeType == 1) {
                        var me = this;
                        return array.some(self.skips || [], function (it) {
                            return me.matchesSelector(el, it);
                        });
                    }
                    return false;
                }
            };
            var html = this._treeTemplate({
                node: node,
                utils: utils
            });
            if (replaceToUuid) {
                query("[" + this.uuidKey + "='" + replaceToUuid + "']", this.treeNode).replaceWith(html);
            } else {
                this.treeNode.innerHTML = html;
            }
            console.timeEnd("HtmlViewer:_renderTree");
        },
        _renderPath: function (lastUuid) {
            console.time("HtmlViewer:_renderPath");
            var refEl = this.elemHash[lastUuid],
                join = Array.prototype.join,
                id, suffix;
            this.path = [];
            if (refEl.nodeType == 3) {
                refEl = refEl.parentNode;
            }
            while (refEl && refEl.tagName && this.el.contains(refEl)) {
                id = domAttr.get(refEl, "id");
                if (id) {
                    suffix = "#" + id;
                } else if (refEl.classList.length) {
                    suffix = "." + join.call(refEl.classList, ".");
                }
                this.path.unshift({
                    uuid: this.getUuid(refEl),
                    tagName: refEl.tagName.toLowerCase() + (suffix || "")
                });
                refEl = refEl.parentNode;
            }
            if (!this._pathTemplate) {
                this._pathTemplate = _.template(this.pathTmpl.innerHTML);
            }
            this.pathNode.innerHTML = this._pathTemplate({path: this.path});
            console.timeEnd("HtmlViewer:_renderPath");
        },
        refresh: function (uuid) {
            var refEl = this.elemHash[uuid];
            if (refEl) {
                this._renderTree(refEl, uuid);
                this._renderPath(uuid);
            }
        },
        release: function () {
            //console.time("HtmlViewer:release");
            if (this.elemHash) {
                var node;
                for (var uuid in this.elemHash) {
                    node = this.elemHash[uuid];
                    if (node && this.el && !this.el.contains(node)) {
                        delete this.elemHash[uuid];
                    }
                }
            }
            //console.timeEnd("HtmlViewer:release");
        },
        hide: function () {
            domStyle.set(this.domNode, "display", "hide");
        },
        show: function () {
            domStyle.set(this.domNode, "display", "block");
        },
        highlight: function (el) {
            var uuid = this.getUuid(el);
            uuid && query('.wrapper[' + this.uuidKey + '="' + uuid + '"]', this.treeNode).forEach(function (it) {
                domClass.add(it, "hover");
            });
        },
        unhighlight: function (el) {
            var uuid = el ? this.getUuid(el) : null;
            query(uuid ? '.wrapper[' + this.uuidKey + '="' + uuid + '"]' : '.wrapper[' + this.uuidKey + ']', this.treeNode).forEach(function (it) {
                domClass.remove(it, "hover");
            });
        },
        select: function (uuid) {
            query('.wrapper', this.treeNode).removeClass("active");
            query('.wrapper[' + this.uuidKey + '="' + uuid + '"]', this.treeNode).addClass("active");
            this._renderPath(uuid);
            //this.emit("Select", {}, [uuid, this.elemHash[uuid]]);
            this.onSelect(uuid,this.elemHash[uuid]);
        },
        onSelect: function (uuid, refEl) {
        },
        _onTreeClick: function (e) {
            var uuid = domAttr.get(e.target, this.uuidKey);
            uuid && this.select(uuid);
        },
        _onPathClick: function (e) {
            var uuid = domAttr.get(e.target, this.uuidKey);
            if (uuid) {
                this.select(uuid);
                this.scrollTo(uuid);
            }
        },
        onClick: function (refEl) {
        },
        _onMouseover: function (e) {
            var uuid = e.target ? domAttr.get(e.target, this.uuidKey) : null;
            if (uuid) {
                var el = this.elemHash[uuid];
                if (el) {
                    this.highlight(el);
                    this.emit("Mouseover", e, [el]);
                }
            }
        },
        _onMouseout: function (e) {
            var uuid = e.target ? domAttr.get(e.target, this.uuidKey) : null;
            if (uuid) {
                var el = this.elemHash[uuid];
                if (el) {
                    this.unhighlight(el);
                    this.emit("Mouseout", e, [el]);
                }
            }
        },
        onMouseover: function (refEl) {
        },
        onMouseout: function (refEl) {
        },
        destroy: function () {
            this._cleanupHandlers();
            if (this._releaseLoop) {
                clearTimeout(this._releaseLoop);
            }
            this.inherited(arguments);
            delete this.el;
            delete this.treeTmpl;
            delete this.pathTmpl;
            delete this.treeNode;
            delete this.pathNode;
            delete this.elemHash;
        }
    });
});