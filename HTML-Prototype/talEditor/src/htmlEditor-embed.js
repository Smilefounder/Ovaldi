/**
 * Created by Raoh on 2014/9/17.
 */
require([
    "dojo/_base/config",
    "dojo/_base/lang",
    "dojo/parser",
    "dojo/on",
    "dojo/keys",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "tal/widgets/Masker",
    "dijit/registry",
    "dojox/uuid/generateTimeBasedUuid",
    "dojo/domReady!"
], function (config, lang, parser, on, keys, domClass, domAttr, domStyle, domConst, domGeom, Masker, registry) {
    var win = window,
        doc = document,
        body = doc.body,
        kbContainer = dojo.byId("kbContainer"),
        kbHover, kbHolder, kbMasker,
        mceEditor, editEl, ptopic;

    parser.parse(kbContainer).then(function () {
        kbHover = registry.byId("kbHover");
        kbHolder = registry.byId("kbHolder");
        kbMasker = registry.byId("kbMasker");

        on(body, "mousemove", function (e) {
            ptopic && ptopic.publish("dom/mousemove", e);
        });
        on(body, "mouseover", function (e) {
            if (body == e.target ||
                mceEditor ||
                kbHover.domNode.contains(e.target) ||
                kbHolder.domNode.contains(e.target) ||
                kbMasker.domNode.contains(e.target)) {
                return;
            }
            ptopic && ptopic.publish("dom/mouseover", e);

            if (e.target.isContentEditable) {
                return;
            }
            kbHover.mask(e.target);

        });
        on(body, "mouseout", function (e) {
            if (body == e.target ||
                mceEditor ||
                kbHover.domNode.contains(e.target) ||
                kbHolder.domNode.contains(e.target) ||
                kbMasker.domNode.contains(e.target)) {
                return;
            }
            kbHover.unmask(e.target);
            ptopic && ptopic.publish("dom/mouseout", e);
        });
        on(body, "click", function (e) {
            if (body == e.target ||
                mceEditor ||
                kbHover.domNode.contains(e.target) ||
                kbHolder.domNode.contains(e.target) ||
                kbMasker.domNode.contains(e.target) ||
                (editEl && editEl.contains(e.target))) {
                return;
            }
            //TODO://判断是否点击在tinymce的二级菜单上，或者暂时停止监听click事件

            ptopic && ptopic.publish("dom/click", e);
            e.preventDefault();
            e.stopPropagation();
            if (e.target.isContentEditable) {
                return;
            }
            kbHolder.mask(e.target);
        });
        on(win, "resize,scroll", function (e) {
            var hoveEl = kbHover.el, holdEl = kbHolder.el;
            kbHover.unmask();
            kbHolder.unmask();

            hoveEl && kbHover.mask(hoveEl);
            holdEl && kbHolder.mask(holdEl);
        });
        on(win, "resize,scroll", function (e) {
            kbMasker.el && kbMasker.mask(kbMasker.el);
            kbHover.el && kbHover.mask(kbHover.el);
            kbHolder.el && kbHolder.mask(kbHolder.el);
        });
    });

    setTimeout(function loop() {
        if (parent.topic) {
            ptopic = parent.topic;
            ptopic.publish("dom/view", {
                target: body,
                skips: ["#kbContainer"]
            });
            var skip = /^br$/i;
            ptopic.subscribe("codeviewer/mouseover", function (e) {
                if (e.refEl.nodeType == 1 && !skip.test(e.refEl.tagName)) {
                    kbHover.mask(e.refEl);
                } else if (e.refEl.nodeType == 3) {
                    kbHover.mask(e.refEl.parentNode);
                }
            });
            ptopic.subscribe("codeviewer/mouseout", function (e) {
                if (e.refEl.nodeType == 1) {
                    kbHover.unmask(e.refEl);
                } else if (e.refEl.nodeType == 3) {
                    kbHover.unmask(e.refEl.parentNode);
                }
            });
            ptopic.subscribe("codeviewer/view", function (e) {
                if (e.refEl.nodeType == 1 && !skip.test(e.refEl.tagName)) {
                    kbHolder.mask(e.refEl);
                } else if (e.refEl.nodeType == 3) {
                    kbHolder.mask(e.refEl.parentNode);
                }
            });
            ptopic.subscribe("codeviewer/click", function (e) {
                if (e.refEl.nodeType == 1 && !skip.test(e.refEl.tagName)) {
                    kbHolder.mask(e.refEl);
                } else if (e.refEl.nodeType == 3) {
                    kbHolder.mask(e.refEl.parentNode);
                }
            });
            ptopic.subscribe("inlinemenu/edit", function (e) {
                var el = editEl = e.refEl;
                if (el.firstElementChild) {//init text/html editor
                    //TODO:保留原始DOM，记录原始DOM的所有attributes
                    //不能用clone原始DOM的方式，因为用户进入tinymce编辑时，也可以在CodeViewer中修改
                    //问题:CodeViewer中是否可以修改DOM结构？如果可以，正在编辑的tinymce难以同步
                    var uuid = dojox.uuid.generateTimeBasedUuid();
                    domClass.add(el, [uuid, "kb-inline-editor-field"]);
                    tinymce.init({
                        selector: el.tagName + "." + uuid,
                        inline: true,
                        cleanup: true,
                        browser_spellcheck: false,
                        plugins: [
                            ["exit advlist autolink link image lists charmap hr anchor pagebreak spellchecker code"],
                            ["searchreplace wordcount visualblocks visualchars media nonbreaking"],
                            ["table directionality emoticons template paste"]
                        ],
                        schema: "html5",
                        menubar: false,
                        force_p_newlines: false,
                        forced_root_block: "",
                        toolbar_items_size: 'small',
                        toolbar: "exit | undo redo | bold italic forecolor formatselect | indent outdent | alignleft aligncenter alignright alignjustify | bullist numlist | image link unlink | code",
                        verify_html: false,
                        setup: function (ed) {
                            ed.on('BeforeSetContent', function (e) {
                                e.format = 'raw';
                            });
                        },
                        init_instance_callback: function (ed) {
                            mceEditor = ed;
                            ed.focus();
                            //TODO:考虑引入tinymce.full就不需要定时器了
                            setTimeout(function () {
                                ed.focus();
                                ed.off("blur");
                            }, 200);
                            kbMasker.mask(el);
                            ed.on("NodeChange", function () {
                                kbMasker.mask(el);
                            });
                            ed.on("remove", function () {
                                domClass.remove(el, [uuid, "kb-inline-editor-field"]);
                                kbMasker.unmask();

                                //TODO:将tinymce产生的attribute删除
                                //更新CodeViewer
                                ptopic && ptopic.publish("dom/modified", {target: el});
                                editEl = null;
                                mceEditor = null;
                                //TODO:启用Toolbar
                            });
                            //更新CodeViewer,此时el内的元素已经被tinyMCE更新，旧的内存引用失效
                            //ptopic && ptopic.publish("dom/modified", {target: el});
                            //TODO:禁用Toolbar
                        },
                        exit_onexitcallback: function (ed) {
                            ed.save();
                            ed.remove();
                        }
                    });
                } else {//init text/plain editor
                    var _handlers = [
                        on(el, "keypress,keydown,keyup", function (e) {
                            if (e.keyCode == keys.ENTER) {
                                e.preventDefault();
                                e.stopImmediatePropagation();//阻止tinyMCE回车自动插入BR标签
                            }
                        }),
                        on(el, "paste", function (e) {
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
                            range.setStart(node, node.length);
                            range.collapse(true);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        })
                    ];

                    function _clearupHandlers() {
                        var h;
                        while (h = _handlers.pop()) {
                            h.remove();
                        }
                    }

                    var uuid = dojox.uuid.generateTimeBasedUuid();
                    domClass.add(el, [uuid, "kb-inline-editor-field"]);
                    tinymce.init({
                        selector: el.tagName + "." + uuid,
                        inline: true,
                        cleanup: true,
                        browser_spellcheck: false,
                        schema: "html5",
                        menubar: false,
                        force_p_newlines: false,
                        forced_root_block: "",
                        toolbar_items_size: 'small',
                        plugins: ["exit"],
                        toolbar: "exit | undo redo",
                        verify_html: false,
                        setup: function (ed) {
                            ed.on('BeforeSetContent', function (e) {
                                e.format = 'raw';
                            });
                        },
                        init_instance_callback: function (ed) {
                            mceEditor = ed;
                            ed.focus();
                            setTimeout(function () {
                                ed.focus();
                                ed.off("blur");
                            }, 200);

                            kbMasker.mask(el);

                            ed.on("NodeChange", function () {
                                kbMasker.mask(el);
                            });
                            ed.on("remove", function () {
                                _clearupHandlers();
                                domClass.remove(el, [uuid, "kb-inline-editor-field"]);
                                kbMasker.unmask();
                                //TODO:将tinymce产生的attribute删除

                                //更新CodeViewer
                                ptopic && ptopic.publish("dom/modified", {target: el});
                                editEl = null;
                                mceEditor = null;
                                //TODO:启用Toolbar
                            });
                            //更新CodeViewer,此时el内的元素已经被tinymce更新，旧的内存引用失效
                            //ptopic && ptopic.publish("dom/modified", {target: el});
                            //TODO:禁用Toolbar
                        },
                        exit_onexitcallback: function (ed) {
                            ed.save();
                            ed.remove();
                        }
                    });
                }
                kbHover.unmask();
                kbHolder.unmask();
            });
        } else {
            setTimeout(loop, 10);
        }
    }, 10);
});