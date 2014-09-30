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
    "dojo/dom-geometry",
    "dijit/registry",
    "dojo/domReady!"
], function (parser, topic, on, domClass, domAttr, domStyle, domGeom, registry) {
    window.topic = topic;
    var kbHtmlViewer,
        kbEmbedFrame = dojo.byId("kbEmbedFrame"),
        kbDragPane = dojo.byId("kbDragPane"),
        kbSplitContainer, kbInlineMenu, kbDialog, el;

    parser.parse().then(function () {
        kbInlineMenu = registry.byId("kb_inlinemenu");
        kbSplitContainer = registry.byId("kbSplitContainer");
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
        kbInlineMenu.addMenu({
            text: "Edit image",
            visibility: function (menu) {
                return el && (/^img$/i).test(el.tagName);
            },
            callback: function (menu) {
                kbDialog.set("imageSrc", el.src);
                kbDialog.set("imageTitle", el.title || "");
                kbDialog.set("imageAlt", el.alt || "");
                kbDialog.open();
                this.hide();
            }
        });

        on(window, "resize", function () {
            kbSplitContainer.resize();
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
            el = e.target;
            var uuid = kbHtmlViewer.getUuid(el);
            kbHtmlViewer.select(uuid);
            kbHtmlViewer.scrollTo(uuid);

            //更新InlineMenu
            kbInlineMenu.refresh();
            kbInlineMenu.show(e.clientX, e.clientY);
            //TODO:处理显示边界逻辑

            //处理自动隐藏逻辑
            var _handler = topic.subscribe("dom/mousemove", function (e) {
                var box = domGeom.getMarginBox(kbInlineMenu.domNode);
                if (e.clientX < box.l - 50 || e.clientX > box.l + box.w + 50 || e.clientY < box.t - 50 || e.clientY > box.t + box.h + 50) {
                    kbInlineMenu.hide();
                    _handler.remove();
                }
            });
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