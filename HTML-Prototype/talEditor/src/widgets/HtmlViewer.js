define([
    "ko",
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
    "./_koTemplatedMixin",
    "dojo/text!./templates/HtmlViewer.html",
    "dojo/i18n!./nls/CodeViewer",
    "dojo/NodeList-traverse",
    "dojo/NodeList-manipulate"
], function (ko, declare, array, lang, on, string, keys, query, domClass, domAttr, domStyle, domConst, geom, _WidgetBase, _koTemplatedMixin, template, res) {
    var ix = 1,
        whiteSpaceRegExp = /^\s*$/m,
        voidElementsRegExp = /^area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr$/i;

    var CodeViewer = declare([_WidgetBase, _koTemplatedMixin], {
        baseClass: "kb-code-viewer",
        templateString: template,
        skips: ["script", "link"],//tagName or id
        insertAttrTitle: "Insert attribute",
        el: null,
        elemHash: null,
        treeNode: null,
        inputNode: null,
        tmplNode: null,
        uuidKey: "data-kooboo-uuid",
        nodeKey: "data-kooboo-node",
        disabled: false,
        constructor: function () {
            dojo.safeMixin(this, arguments);
            this.inherited(arguments);
            this.paths = ko.observableArray([]);
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
        isEmpty:function(textNode){
            return textNode.nodeType == 3 && whiteSpaceRegExp.test(textNode.textContent);
        },
        isTextOnly: function (el) {
            return el.nodeType == 3 || !el.firstElementChild;
        },
        postCreate: function () {
            this.inherited(arguments);
            //处理折叠事件
            this.own(on(this.treeNode, on.selector(".sprite", "click"), lang.hitch(this, function (e) {
                console.log("collapse");
                var uuid = domAttr.get(e.target, this.uuidKey),
                    collapseHandler = query("li[" + this.uuidKey + "='" + uuid + "']", this.treeNode)[0],
                    collapsed = domClass.contains(collapseHandler, "collapsed");

                this[collapsed ? "expand" : "collapse"](uuid);
            })));
            //处理attribute name事件
            this.own(on(this.treeNode, on.selector("code.attr-name", "click"), lang.hitch(this, function (e) {
                var el = e.target,
                    oldAttr = el.textContent,
                    attrEl = el.parentNode,
                    uuid = domAttr.get(el, this.uuidKey),
                    refEl = this.elemHash[uuid],
                    value = refEl.getAttribute(oldAttr),
                    newAttr;

                this._renderInputNodeTo(el);

                this._handlers = this._handlers.concat([
                    on(this.inputNode, "blur", lang.hitch(this, function (e) {
                        var newAttr = this.inputNode.value;
                        el.textContent = newAttr;

                        if (newAttr != oldAttr) {
                            refEl.removeAttribute(oldAttr);
                        }
                        if (newAttr) {
                            refEl.setAttribute(newAttr, value);
                        } else {
                            domConst.destroy(attrEl);
                        }

                        this._cleanupHandlers();
                        this._clearupInputNode();
                    })),
                    on(this.inputNode, "keypress", lang.hitch(this, function (e) {
                            newAttr = this.inputNode.value;
                            el.textContent = newAttr;
                            this._resizeInputNodeTo(el);

                            if (e.keyCode == keys.ENTER || e.charCode == 61/*判断是否按下"="键*/) {
                                e.preventDefault();
                                this._cleanupHandlers();
                                this._clearupInputNode();

                                var codes = query("code,.add-attr", this.treeNode),
                                    idx = codes.indexOf(el);

                                if (newAttr != oldAttr) {
                                    refEl.removeAttribute(oldAttr);
                                }
                                if (newAttr) {
                                    refEl.setAttribute(newAttr, value);
                                } else {
                                    domConst.destroy(attrEl);
                                }

                                for (var i = idx + 1, j = codes.length; i < j; i++) {
                                    if (codes[i] && codes[i].parentNode) {
                                        on.emit(codes[i], "click", e);
                                        break;
                                    }
                                }
                            }
                        }
                    )),
                    on(this.inputNode, "keyup", lang.hitch(this, function (e) {
                        el.textContent = this.inputNode.value;
                        this._resizeInputNodeTo(el);
                    }))
                ])
                ;
            })));
            //处理attribute value事件
            this.own(on(this.treeNode, on.selector("code.attr-value", "click"), lang.hitch(this, function (e) {
                var el = e.target,
                    uuid = domAttr.get(el, this.uuidKey),
                    attrName = new query.NodeList(el).prev("code").text(),
                    refEl = this.elemHash[uuid];

                this._renderInputNodeTo(el);
                this._handlers = this._handlers.concat([
                    on(this.inputNode, "blur", lang.hitch(this, function (e) {
                        refEl.setAttribute(attrName, el.textContent = this.inputNode.value);
                        this._cleanupHandlers();
                        this._clearupInputNode();
                    })),
                    on(this.inputNode, "keypress", lang.hitch(this, function (e) {
                        refEl.setAttribute(attrName, el.textContent = this.inputNode.value);
                        this._resizeInputNodeTo(el);
                        if (e.keyCode == keys.ENTER || e.charCode == 61/*判断是否按下"="键*/) {
                            e.preventDefault();
                            this._cleanupHandlers();
                            this._clearupInputNode();

                            var codes = query("code,.add-attr", this.treeNode),
                                idx = codes.indexOf(el);

                            for (var i = idx + 1, j = codes.length; i < j; i++) {
                                if (codes[i] && codes[i].parentNode) {
                                    on.emit(codes[i], "click", {bubbles: true});
                                    break;
                                }
                            }
                        }
                    })),
                    on(this.inputNode, "keyup", lang.hitch(this, function (e) {
                        refEl.setAttribute(attrName, el.textContent = this.inputNode.value);
                        this._resizeInputNodeTo(el);
                    }))
                ]);
            })));
            //处理TextNode事件
            this.own(on(this.treeNode, on.selector("code.node-text", "click"), lang.hitch(this, function (e) {
                var el = e.target,
                    uuid = domAttr.get(el, this.uuidKey),
                    refEl = this.elemHash[uuid];

                this._renderInputNodeTo(el);
                this._handlers = this._handlers.concat([
                    on(this.inputNode, "blur", lang.hitch(this, function (e) {
                        refEl.textContent = el.textContent = this.inputNode.value;
                        this._cleanupHandlers();
                        this._clearupInputNode();
                    })),
                    on(this.inputNode, "keypress", lang.hitch(this, function (e) {
                        refEl.textContent = el.textContent = this.inputNode.value;
                        this._resizeInputNodeTo(el);

                        if (e.keyCode == keys.ENTER || e.charCode == 61/*判断是否按下"="键*/) {
                            e.preventDefault();
                            this._cleanupHandlers();
                            this._clearupInputNode();

                            var codes = query("code,.add-attr", this.treeNode),
                                idx = codes.indexOf(el);
                            for (var i = idx + 1, j = codes.length; i < j; i++) {
                                if (codes[i] && codes[i].parentNode) {
                                    on.emit(codes[i], "click", {bubbles: true});
                                    break;
                                }
                            }
                        }
                    })),
                    on(this.inputNode, "keyup", lang.hitch(this, function (e) {
                        refEl.textContent = el.textContent = this.inputNode.value;
                        this._resizeInputNodeTo(el);
                    }))
                ]);
            })));
            //处理新增attribute事件
            this.own(on(this.treeNode, on.selector(".new-attribute", "click"), lang.hitch(this, function (e) {
                var el = e.target,
                    uuid = domAttr.get(el, this.uuidKey),
                    refEl = this.elemHash[uuid],
                    attrEl = domConst.toDom(string.substitute('<span><code class="attr-name" ${0}="${1}">&nbsp;</code>="<code class="attr-value" ${0}="${1}">&nbsp;</code>"</span>', [this.uuidKey, uuid])),
                    attrNameEl = query("code", attrEl)[0],
                    attr;

                domConst.place(attrEl, el.parentNode, "before");
                this._renderInputNodeTo(attrNameEl);

                this._handlers = this._handlers.concat([
                    on(this.inputNode, "blur", lang.hitch(this, function (e) {
                        attr = this.inputNode.value;
                        attrNameEl.textContent = attr;

                        if (attr) {
                            refEl.setAttribute(attr, "");
                        } else {
                            domConst.destroy(attrEl);
                        }
                        this._cleanupHandlers();
                        this._clearupInputNode();
                    })),
                    on(this.inputNode, "keypress", lang.hitch(this, function (e) {
                        attr = this.inputNode.value;
                        attrNameEl.textContent = attr;
                        this._resizeInputNodeTo(el);

                        if (e.keyCode == keys.ENTER || e.charCode == 61/*判断是否按下"="键*/) {
                            e.preventDefault();
                            this._cleanupHandlers();
                            this._clearupInputNode();

                            var codes = query("code", this.treeNode),
                                idx = codes.indexOf(attrNameEl);

                            if (attr) {
                                refEl.setAttribute(attr, "");
                            } else {
                                domConst.destroy(attrEl);
                            }

                            for (var i = idx + 1, j = codes.length; i < j; i++) {
                                if (codes[i] && codes[i].parentNode) {
                                    on.emit(codes[i], "click", {bubbles: true});
                                    break;
                                }
                            }
                        }
                    })),
                    on(this.inputNode, "keyup", lang.hitch(this, function (e) {
                        attrNameEl.textContent = this.inputNode.value;
                        this._resizeInputNodeTo(attrNameEl);
                    }))
                ]);
            })));
        },
        _setElAttr: function (el) {
            this._set("el", el);
            this._set("elemHash", {});
        },
        view: function (el, skips /*e.g:["#kbContainer","script","link"]*/) {
            if (!this.disabled) {

                this.set("el", el);
                this.set("skips", skips);
                console.time("_initNode");
                this._renderTree(this._initNode(this.el));
                console.timeEnd("_initNode");
                this._renderPath(this.getUuid(this.el));

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
                this._renderPath(uuid);
            }
        },
        _renderInputNodeTo: function (el) {
            this._resizeInputNodeTo(el);
            this.inputNode.value = whiteSpaceRegExp.test(el.textContent) ? "" : el.textContent;
            this.inputNode.focus();
            this.inputNode.select();
        },
        _resizeInputNodeTo: function (el) {
            var box = geom.getMarginBox(el),
                maxWidth = this.treeNode.clientWidth;
            domStyle.set(this.inputNode, {
                left: box.l + "px",
                top: box.t + "px",
                width: Math.min(maxWidth - box.l, box.w + 12) + "px",//避免输入框溢出
                display: "block"
            });
        },
        _clearupInputNode: function () {
            domStyle.set(this.inputNode, "display", "none");
            this.inputNode.value = "";
        },
        _cleanupHandlers: function () {
            var h;
            while (h = this._handlers.pop()) {
                h.remove();
            }
        },
        _initNode: function (el) {
            var self = this;

            function skip(el) {
                if (el.nodeType == 1) {
                    return array.some(self.skips || [], function (it) {
                        return it == ("#" + (domAttr.get(el, "id") || "")) || el.tagName.toLowerCase() == it;
                    });
                }
                return false;
            }

            function loadNodes(elems, parentUuid) {
                var nodes = [];
                array.forEach(elems, function (it) {
                    if (it.nodeType == 8) {//Comments
                        return;
                    }
                    var node, uuid = it[self.uuidKey] || self.generateUuid(), children;
                    if ((it.nodeType == 3) && !whiteSpaceRegExp.test(it.textContent)) {//TextNode
                        node = {
                            uuid: uuid,
                            parentUuid: parentUuid,
                            nodeType: it.nodeType,
                            textContent: it.textContent,
                            tagName: null,
                            attributes: [],
                            selfClosing: false,
                            textOnly: false,
                            children: []
                        };
                    } else if ((it.nodeType == 1) && !skip(it)) {//Element
                        children = loadNodes(it.childNodes, uuid);
                        node = {
                            uuid: uuid,
                            parentUuid: parentUuid,
                            nodeType: it.nodeType,
                            textContent: it.textContent,
                            tagName: it.tagName.toLowerCase(),
                            attributes: it.attributes,
                            selfClosing: self.isVoidElement(it),
                            textOnly: it.children.length == 0,
                            children: children
                        };
                    }
                    if (node) {
                        nodes.push(node);
                        self.elemHash[uuid] = it;
                        it[self.uuidKey] = uuid;
                        it[self.nodeKey] = node;
                    }
                });
                return nodes;
            }

            return loadNodes([el])[0];
        },
        _renderTree: function (node, replaceToUuid) {
            var dom = domConst.toDom("<div>" + this.tmplNode.innerHTML + "</div>");
            ko.applyBindings(node, dom);
            if (replaceToUuid) {
                query("[" + this.uuidKey + "='" + replaceToUuid + "']", this.treeNode).replaceWith(dom.innerHTML);
            } else {
                this.treeNode.innerHTML = dom.innerHTML;
            }
        },
        refresh: function (uuid) {
            var refEl = this.elemHash[uuid];
            if (refEl) {
                var node = this._initNode(refEl);
                this._renderTree(node, uuid);
                this._renderPath(node.uuid);
            }
        },
        release: function () {
            if (this.elemHash) {
                var node;
                for (var uuid in this.elemHash) {
                    node = this.elemHash[uuid];
                    if (node && this.el && !this.el.contains(node)) {
                        console.log("delete", node);
                        delete this.elemHash[uuid];
                    }
                }
            }
        },
        _renderPath: function (lastUuid) {
            var refEl = this.elemHash[lastUuid],
                paths = [],
                node, id, classes, suffix;

            if (refEl.nodeType == 3) {
                refEl = refEl.parentNode;
            }
            while (refEl && refEl.tagName && this.el.contains(refEl)) {
                id = domAttr.get(refEl, "id"), classes = domAttr.get(refEl, "class");
                if (id) {
                    suffix = "#" + id;
                } else if (classes) {
                    suffix = [""].concat(classes.split(" ")).join(".");
                }
                node = {
                    uuid: this.getUuid(refEl),
                    tagName: refEl.tagName.toLowerCase() + (suffix || "")
                };
                paths.unshift(node);
                refEl = refEl.parentNode;
            }
            this.paths(paths);
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
        },
        _onTreeClick: function (e) {
            var uuid = domAttr.get(e.target, this.uuidKey);
            if (uuid) {
                var refEl = this.elemHash[uuid];
                this.select(uuid);
                this.emit("Click", e, [refEl]);
            }
        },
        _onPathClick: function (e) {
            var uuid = domAttr.get(e.target, this.uuidKey);
            if (uuid) {
                var refEl = this.elemHash[uuid];
                this.scrollTo(uuid);
                this.emit("Click", e, [refEl]);
            }
        },
        onClick: function (refEl) {
        },
        _onMouseover: function (e) {
            var uuid = e.target ? domAttr.get(e.target, this.uuidKey) : null;
            if (uuid) {
                var el = this.elemHash[uuid];
                this.highlight(el);
                this.emit("Mouseover", e, [el]);
            }
        },
        _onMouseout: function (e) {
            var uuid = e.target ? domAttr.get(e.target, this.uuidKey) : null;
            if (uuid) {
                var el = this.elemHash[uuid];
                this.unhighlight(el);
                this.emit("Mouseout", e, [el]);
            }
        },
        onMouseover: function (refEl) {
        },
        onMouseout: function (refEl) {
        },
        destroy: function () {
            this.inherited(arguments);
            this._cleanupHandlers();
            if (this._releaseLoop) {
                clearTimeout(this._releaseLoop);
            }
            delete this.el;
            delete this.treeNode;
            delete this.inputNode;
            delete this.elemHash;
            delete this.paths;
        }
    });
    return CodeViewer;
});