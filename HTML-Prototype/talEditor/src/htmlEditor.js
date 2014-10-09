/**
 * Created by Raoh on 2014/9/17.
 */
require([
    "dojo/parser",
    "dojo/topic",
    "dojo/on",
    "dojo/dom-class",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dijit/registry",
    "tal/widgets/ImageDialog",
    "tal/widgets/BackgroundImageDialog",
    "dojo/domReady!"
], function (parser, topic, on, domClass, domAttr, domStyle, domConst, domGeom, registry, ImageDialog, BackgroundImageDialog) {
    window.topic = topic;
    var body = document.body,
        kbEmbedFrame = dojo.byId("kbEmbedFrame"),
        kbDragPane = dojo.byId("kbDragPane"),
        kbSplitContainer, kbInlineMenu, kbHtmlViewer, el;

    parser.parse().then(function () {
        kbInlineMenu = registry.byId("kb_inlinemenu");
        kbSplitContainer = registry.byId("kbSplitContainer");
        kbSplitContainer.toggle();
        kbHtmlViewer = registry.byId("kbHtmlViewer");
        kbInlineMenu.hide();

        kbInlineMenu.addMenu({
            text: "Edit",
            visibility: function (menu) {
                return el && !(/^img$/i).test(el.tagName);
            },
            callback: function (menu) {
                topic.publish("inlinemenu/edit", {refEl: el});
                kbInlineMenu.hide();
            }
        });


        var imgDialog;
        kbInlineMenu.addMenu({
            text: "Edit image",
            visibility: function (menu, dom) {
                return el && (/^img$/i).test(el.tagName);
            },
            callback: function (menu) {
                if (!imgDialog) {
                    imgDialog = new ImageDialog();
                    imgDialog.placeAt(body);
                    imgDialog.startup();
                    imgDialog.on("Open", function () {
                        this.src(el.src);
                        this.alt(el.alt);
                        this.title(el.title);
                    });
                    imgDialog.on("Close", function () {
                        el.src = this.src();
                        el.alt = this.alt();
                        el.title = this.title();
                    });
                    imgDialog.on("Change", function () {
                        console.log("Change image");
                        $.pop({
                            url: "http://192.168.1.231:9999/Contents/MediaContent/Selection?siteName=Test&UUID=Test&return=%2FSites%2FView%3FsiteName%3DTest&listType=grid&SingleChoice=true",
                            width: 900,
                            height: 500,
                            dialogClass: 'iframe-dialog',
                            frameHeight: '100%',
                            onload: function (handle, pop, config) {
                                window.onFileSelected = function (src, text) {
                                    imgDialog.src("src", src);
                                    el.src = src;
                                };
                            }
                        });
                    });
                }
                imgDialog.open();
                this.hide();
            }
        });
        var bgImgDialog;
        kbInlineMenu.addMenu({
            text: "Edit background image",
            visibility: function (menu) {
                return true;//TODO:排除不可设置背景图片的tag
            },
            callback: function (menu) {
                if (!bgImgDialog) {
                    bgImgDialog = new BackgroundImageDialog();
                    bgImgDialog.placeAt(body);
                    bgImgDialog.startup();
                    bgImgDialog.on("Open", function () {
                        var cs = domStyle.getComputedStyle(el);
                        //TODO:处理属性默认值和百分比
                        this.set("src", cs.getPropertyValue("background-image"));
                        this.set("repeated", cs.getPropertyValue("background-repeated"));
                        this.set("positionX", cs.getPropertyValue("background-position-x"));
                        this.set("positionY", cs.getPropertyValue("background-position-y"));
                    });
                    bgImgDialog.on("Close", function () {
                        var src = this.get("src"),
                            repeated = this.get("repeated"),
                            positionX = this.get("positionX"),
                            positionY = this.get("positionY");

                        if (src) {
                            domStyle.set(el, "background-image", src);
                        }
                        if (repeated) {
                            domStyle.set(el, "background-repeated", repeated);
                        }
                        if (positionX) {
                            domStyle.set(el, "background-position-x", positionX);
                        }
                        if (positionY) {
                            domStyle.set(el, "background-position-y", positionY);
                        }
                    });
                    bgImgDialog.on("Change", function () {
                        debugger;
                        $.pop({
                            url: "http://192.168.1.231:9999/Contents/MediaContent/Selection?siteName=Test&UUID=Test&return=%2FSites%2FView%3FsiteName%3DTest&listType=grid&SingleChoice=true",
                            width: 900,
                            height: 500,
                            dialogClass: 'iframe-dialog',
                            frameHeight: '100%',
                            onload: function (handle, pop, config) {
                                window.onFileSelected = function (src, text) {
                                    imgDialog.src("src", src);
                                    el.src = src;
                                };
                            }
                        });
                    });
                }
                bgImgDialog.open();
                this.hide();
            }
        });

        kbHtmlViewer.on("Mouseover", function (refEl) {
            topic.publish("codeviewer/mouseover", {refEl: refEl});
        });
        kbHtmlViewer.on("Mouseout", function (refEl) {
            topic.publish("codeviewer/mouseout", {refEl: refEl});
        });
        kbHtmlViewer.on("View", function (refEl) {
            topic.publish("codeviewer/view", {refEl: refEl});
        });
        kbHtmlViewer.on("Click", function (refEl) {
            topic.publish("codeviewer/click", {refEl: refEl});
        });

        /*init iframe topic*/
        topic.subscribe("dom/view", function (e) {
            kbHtmlViewer.view(e.target, e.skips);
        });
        topic.subscribe("dom/click", function (e) {
            //TODO:关闭其它Dialog
            if (el != e.target && imgDialog && imgDialog.isOpen()) {
                imgDialog.close();
            }

            el = e.target;

            //刷新InlineMenu
            kbInlineMenu.refresh();

            //TODO:处理显示边界逻辑

            kbInlineMenu.show(e.clientX, e.clientY);

            //处理自动隐藏逻辑
            var box = domGeom.getMarginBox(kbInlineMenu.domNode);
            var _handler = topic.subscribe("dom/mousemove", function (e) {
                if (e.clientX < box.l - 50 || e.clientX > box.l + box.w + 50 || e.clientY < box.t - 50 || e.clientY > box.t + box.h + 50) {
                    kbInlineMenu.hide();
                    _handler.remove();
                }
            });

            var uuid = kbHtmlViewer.getUuid(el);
            kbHtmlViewer.select(uuid);
            kbHtmlViewer.scrollTo(uuid);
        });
        topic.subscribe("dom/mouseover", function (e) {
            kbHtmlViewer.highlight(e.target);
        });
        topic.subscribe("dom/mouseout", function (e) {
            kbHtmlViewer.unhighlight(e.target);
        });
        topic.subscribe("dom/modified", function (e) {
            var uuid = kbHtmlViewer.getUuid(e.target);
            kbHtmlViewer.refresh(uuid);
        });

        kbHtmlViewer.view(dojo.byId("header"));
    });
})