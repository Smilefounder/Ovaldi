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
    "tal/widgets/StyleAccordion",
    "tal/widgets/menuItems/EditText",
    "tal/widgets/menuItems/EditImage",
    "tal/widgets/menuItems/EditStyle",
    "dojo/domReady!"
], function (parser, topic, on, domClass, domAttr, domStyle, domConst, domGeom, registry, ImageDialog, BackgroundImageDialog, StyleAccordion, EditText, EditImage,EditStyle) {
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

        kbInlineMenu.addMenu(new EditText(kbInlineMenu));
        kbInlineMenu.addMenu(new EditImage(kbInlineMenu));

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
                    bgImgDialog.on("open", function () {
                        var cs = domStyle.getComputedStyle(el);
                        //TODO:处理属性默认值和百分比
                        this.css({
                            "background-image": cs.getPropertyValue("background-image"),
                            "background-repeat": cs.getPropertyValue("background-repeat"),
                            "background-position-x": cs.getPropertyValue("background-position-x"),
                            "background-position-y": cs.getPropertyValue("background-position-y")
                        });
                    });
                    bgImgDialog.on("beforeClose", function () {
                        var css = this.css();
                        console.log(css);
                        for (var p in css) {
                            domStyle.set(el, p, css[p]);
                        }
                    });
                    bgImgDialog.on("close", function () {
                        console.log("close");
                    });
                    bgImgDialog.on("change", function () {
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

        kbInlineMenu.addMenu(new EditStyle(kbInlineMenu));

        kbInlineMenu.addMenu({
            text: "Direct to this page",
            visibility: function () {
                //TODO:需要判断是否URL
                return el && /^a$/i.test(el.tagName);
            },
            callback: function () {
                if (el.href && window.confirm("Do you want to direct to this link?")) {
                    //TODO:通知iframe跳转
                    alert("TODO:通知iframe跳转");
                }
            }
        })

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
            kbInlineMenu.set("el", e.target);
            el = e.target;

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
});