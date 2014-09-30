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
    "tal/widgets/HtmlViewer",
    "dijit/registry",
    "dojox/uuid/generateTimeBasedUuid",
    "dojo/domReady!"
], function (config, lang, parser, on, keys, domClass, domAttr, domStyle, domConst, domGeom, CodeViewer, registry) {
    var win = window,
        doc = document,
        body = doc.body,
        kbContainer = dojo.byId("kb_container"),
        imgSrc = dojo.byId("imgSrc"),
        kbHover, kbHolder, kbInlineMenu, kbDialog,
        mceEditor, ptopic;

    parser.parse(kbContainer).then(function () {
        kbHover = registry.byId("kb_hover");
        kbHolder = registry.byId("kb_holder");
        kbDialog = registry.byId("kb_changeimagedialog");
        kbDialog.on("Change", function () {
            var self = this;
            window.top.$.pop({
                url: "http://192.168.1.231:9999/Contents/MediaContent/Selection?siteName=Test&UUID=Test&return=%2FSites%2FView%3FsiteName%3DTest&listType=grid&SingleChoice=true",
                width: 900,
                height: 500,
                dialogClass: 'iframe-dialog',
                frameHeight: '100%',
                onload: function (handle, pop, config) {
                    window.top.onFileSelected = function (src, text) {
                        self.set("imageSrc", src);
                    };
                }
            });
        });
        kbDialog.on("Save", function (src, title, alt) {
            domAttr.set(kbInlineMenu.el, "src", src);
            domAttr.set(kbInlineMenu.el, "title", title);
            domAttr.set(kbInlineMenu.el, "alt", alt);
            kbHolder.unmask();
            var handler = on(kbInlineMenu.el, "load", function () {
                kbHolder.mask(kbInlineMenu.el);
                handler.remove();
            });
            kbDialog.close();
        });
        kbDialog.on("Cancel", function (src, title, alt) {
            kbDialog.close();
        });

        kbInlineMenu = registry.byId("kb_inlinemenu");
        kbInlineMenu.hide();

        kbInlineMenu.addMenu({
            text: "Edit",
            isVisible: function (kb) {
                return kb.el && kb.el.tagName.toLowerCase() != "img";
            },
            callback: function (kb) {
                if (kb.el.firstElementChild) {//init text/html editor
                    //TODO:保留原始DOM，记录原始DOM的所有attributes
                    //不能用clone原始DOM的方式，因为用户进入tinymce编辑时，也可以在CodeViewer中修改
                    //问题:CodeViewer中是否可以修改DOM结构？如果可以，正在编辑的tinymce难以同步
                    var uuid = dojox.uuid.generateTimeBasedUuid();
                    domClass.add(kb.el, [uuid, "kb-inline-editor-field"]);
                    tinymce.init({
                        selector: kb.el.tagName + "." + uuid,
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
                        height: "200px",
                        toolbar_items_size: 'small',
                        toolbar: "undo redo | bold italic forecolor formatselect | indent outdent | alignleft aligncenter alignright alignjustify | bullist numlist | image link unlink | code",
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
                            }, 200);
                            ed.on("blur", function (e) {
                                ed.save();
                                ed.remove();
                                mceEditor = null;
                                domClass.remove(kb.el, "kb-inline-editor-field");
                                //TODO:将tinymce产生的attribute删除
                                //更新CodeViewer
                                ptopic && ptopic.publish("dom/modified", {
                                    uuid: CodeViewer.getUuid(kb.el)
                                });
                            });
                            ed.on("NodeChange", function (e) {
                                ptopic && ptopic.publish("dom/modified", {
                                    uuid: CodeViewer.getUuid(kb.el)
                                });
                            });
                            //更新CodeViewer,此时kb.el内的元素已经被tinymce更新，旧的引用失效
                            ptopic && ptopic.publish("dom/modified", {
                                uuid: CodeViewer.getUuid(kb.el)
                            });
                        }
                    });
                    domClass.remove(kb.el, uuid);
                } else {//init text/plain editor
                    domClass.add(kb.el, "kb-inline-editor-field");
                    domAttr.set(kb.el, "contenteditable", "true");
                    //TODO:处理标签上的for属性，确保元素获得焦点
                    kb.el.focus();
                    var _handlers = [
                        on(kb.el, "blur", function () {
                            domClass.remove(kb.el, "kb-inline-editor-field");
                            domAttr.remove(kb.el, "contenteditable");
                            clearupHandlers();
                            ptopic && ptopic.publish("dom/modified", {
                                uuid: CodeViewer.getUuid(kb.el)
                            });
                        }),
                        on(kb.el, "keypress,keyup", function (e) {
                            if (e.keyCode == keys.ENTER) {
                                e.preventDefault();
                            } else {
                                ptopic && ptopic.publish("dom/modified", {
                                    uuid: CodeViewer.getUuid(kb.el)
                                });
                            }
                        }),
                        on(kb.el, "paste", function (e) {
                            e.preventDefault();
                            var el = e.target, clip = (e.originalEvent || e).clipboardData, text;
                            if (clip) {
                                text = clip.getData("text/plain");
                            }
                            else {
                                text = window.clipboardData.getData("text");
                                /*if (window.getSelection) {
                                 var newNode = document.createTextNode(text);
                                 window.getSelection().getRangeAt(0).insertNode(newNode);
                                 } else {
                                 document.selection.createRange().pasteHTML(text);
                                 }*/
                            }
                            var sel = window.getSelection(),
                                range = sel.getRangeAt(0),
                                start = range.startOffset,
                                node = document.createTextNode(text);
                            range.deleteContents();
                            range.insertNode(node);
                            range.setStart(node, node.length);
                            range.collapse(true);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        })
                    ];

                    function clearupHandlers() {
                        var h;
                        while (h = _handlers.pop()) {
                            h.remove();
                        }
                    }
                }
                kb.hide();
                kbHover.unmask();
                kbHolder.unmask();
            }
        });
        kbInlineMenu.addMenu({
            text: "Edit image",
            isVisible: function (ed) {
                return ed.el && ed.el.tagName.toLowerCase() == "img";
            },
            callback: function (kb) {
                kbDialog.set("imageSrc", kb.el.src);
                kbDialog.set("imageTitle", kb.el.title || "");
                kbDialog.set("imageAlt", kb.el.alt || "");
                kbDialog.open();
                kb.hide();
            }
        });

        on(body, "mouseover", function (e) {
            if (body == e.target ||
                kbHover.domNode.contains(e.target) ||
                kbHolder.domNode.contains(e.target) ||
                kbInlineMenu.domNode.contains(e.target) ||
                kbDialog.domNode.contains(e.target)) {
                return;
            }
            if (mceEditor && mceEditor.theme.panel && mceEditor.theme.panel.getEl().contains(e.target)) {
                return;
            }
            ptopic && ptopic.publish("dom/mouseover", {refEl: e.target});
            if (e.target.isContentEditable) {
                return;
            }
            kbHover.mask(e.target);

        });
        on(body, "mouseout", function (e) {
            if (body == e.target || kbHover.domNode.contains(e.target) || kbHolder.domNode.contains(e.target) || kbInlineMenu.domNode.contains(e.target)) {
                return;
            }
            if (mceEditor && mceEditor.theme.panel && mceEditor.theme.panel.getEl().contains(e.target)) {
                return;
            }
            kbHover.unmask(e.target);
            ptopic && ptopic.publish("dom/mouseout", {refEl: e.target});
        });
        on(body, "click", function (e) {
            if (body == e.target ||
                kbHover.domNode.contains(e.target) ||
                kbHolder.domNode.contains(e.target) ||
                kbInlineMenu.domNode.contains(e.target) ||
                kbDialog.domNode.contains(e.target)) {
                return;
            }
            if (mceEditor && mceEditor.theme.panel && mceEditor.theme.panel.getEl().contains(e.target)) {
                return;
            }
            ptopic && ptopic.publish("dom/click", {
                refEl: e.target,
                rootEl: body
            });
            //阻止事件冒泡,可能需要考虑更多其它事件
            e.preventDefault();
            e.stopPropagation();
            if (e.target.isContentEditable) {
                return;
            }
            kbHolder.mask(e.target);
            kbInlineMenu.set("el", e.target);

            var box = domGeom.getMarginSize(kbInlineMenu.domNode),
                bodyHeight = Math.max(body.offsetHeight, doc.documentElement.offsetHeight),
                bodyWidth = Math.max(body.offsetWidth, doc.documentElement.offsetWidth),
                origX = e.pageX,
                origY = e.pageY,
                x = origX + 20,
                y = origY > 20 ? origY - 20 : 1,
                minX, maxX, minY, maxY, handler;

            if ((box.w + x) > bodyWidth) {
                x = bodyWidth - box.w;
            }
            if ((box.h + y) > bodyHeight) {
                y = bodyHeight - box.h;
            }
            minX = x - 50, maxX = x + box.w + 50, minY = y - 50, maxY = y + box.h + 50;

            kbInlineMenu.show(x, y);

            handler = on(doc, "mousemove", function (e) {
                if (e.pageX < minX || e.pageX > maxX ||
                    e.pageY < minY || e.pageY > maxY) {
                    kbInlineMenu.hide();
                    handler.remove();
                }
            });
        });

        on(win, "resize,scroll", function (e) {
            var hoveEl = kbHover.el, holdEl = kbHolder.el;
            kbHover.unmask();
            kbHolder.unmask();

            hoveEl && kbHover.mask(hoveEl);
            holdEl && kbHolder.mask(holdEl);
        });
        setTimeout(function loop() {
            if (parent.topic) {
                ptopic = parent.topic;
                ptopic.publish("dom/view", {
                    refEl: body,
                    skips: ["#kb_container"]
                });
                var skip = /^br$/i;
                ptopic.subscribe("codeviewer/mouseover", function (e) {
                    console.log(e.refEl.tagName);
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
            } else {
                setTimeout(loop, 10);
            }
        }, 10);
    });
});