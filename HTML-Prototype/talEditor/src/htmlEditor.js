/**
 * Created by Raoh on 2014/9/17.
 */
require([
    "dojo/parser",
    "dojo/topic",
    "dojo/on",
    "dojo/_base/window",
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
    "tal/widgets/menuItems/EditBackgroundImage",
    "tal/widgets/menuItems/GoToLink",
    "tal/widgets/Overlay",
    "tal/XPath",
    "dojo/main",
    "dojo/domReady!"
], function (parser, topic, on, win, domClass, domAttr, domStyle, domConst, domGeom, registry, ImageDialog, BackgroundImageDialog, StyleAccordion, EditText, EditImage, EditStyle, EditBackgroundImage, GoToLink, Overlay, XPath) {
    window.topic = topic;
    var body = win.body(),
        handlers = [],
        kbEmbedFrame = dojo.byId("kbEmbedFrame"),
        kbDragPane = dojo.byId("kbDragPane"),
        kbSplitContainer, kbInlineMenu, kbHtmlViewer, el;

    var overlay = new Overlay();
    overlay.placeAt(body);
    overlay.startup();
    handlers = handlers.concat([
        on(overlay.domNode, "click", function () {
            topic.publish("overlay/click");
        }),
        topic.subscribe("overlay/show", function () {
            overlay.show();
        }),
        topic.subscribe("overlay/hide", function () {
            overlay.hide();
        })
    ]);

    parser.parse().then(function () {
        kbInlineMenu = registry.byId("kb_inlinemenu");
        kbSplitContainer = registry.byId("kbSplitContainer");
        kbSplitContainer.toggle();
        kbHtmlViewer = registry.byId("kbHtmlViewer");
        kbInlineMenu.hide();

        kbInlineMenu.addMenu(new EditText(kbInlineMenu));
        kbInlineMenu.addMenu(new EditImage(kbInlineMenu));
        kbInlineMenu.addMenu(new EditBackgroundImage(kbInlineMenu));
        kbInlineMenu.addMenu(new EditStyle(kbInlineMenu));
        kbInlineMenu.addMenu(new GoToLink(kbInlineMenu));

        kbHtmlViewer.on("mouseover", function (refEl) {
            topic.publish("codeviewer/mouseover", {refEl: refEl});
        });
        kbHtmlViewer.on("mouseout", function (refEl) {
            topic.publish("codeviewer/mouseout", {refEl: refEl});
        });
        kbHtmlViewer.on("view", function (refEl) {
            topic.publish("codeviewer/view", {refEl: refEl});
        });
        kbHtmlViewer.on("click", function (refEl) {
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
    });

    handlers.push(on(win.global, "unload", function () {
        var h;
        while (h = handlers.pop()) {
            h.remove();
        }
    }));
});