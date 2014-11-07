/**
 * Created by Raoh on 2014/9/17.
 */
require([
    "tal/css/CSSStyleSheet",
    "dojo/parser",
    "dojo/topic",
    "dojo/on",
    "dojo/query",
    "dojo/_base/array",
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
], function (CSSStyleSheet, parser, topic, on, query, array, win, domClass, domAttr, domStyle, domConst, domGeom, registry, ImageDialog, BackgroundImageDialog, StyleAccordion, EditText, EditImage, EditStyle, EditBackgroundImage, GoToLink, Overlay, XPath) {
    var wind = win.global,
        body = win.body(),
        handlers = [],
        kbEmbedFrame = dojo.byId("kbEmbedFrame"),
        kbDragPane = dojo.byId("kbDragPane"),
        kbSplitContainer, kbInlineMenu, kbHtmlViewer, kbCssPanel;
    //暴露topic给iframe访问
    wind.topic = topic;

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
        kbHtmlViewer = registry.byId("kbHtmlViewer");
        kbInlineMenu.hide();
        kbCssPanel = registry.byId("kbCssPanel");

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
        kbHtmlViewer.on("select", function (uuid, refEl) {
            kbCssPanel.view(refEl.nodeType == 1 ? refEl : refEl.parentNode);
            topic.publish("codeviewer/select", {refEl: refEl});
        });

        /*init iframe topic*/
        var _hideInlineMenuHandler;
        handlers = handlers.concat([
            topic.subscribe("sandbox/styleSheetsLoad", function (e) {
                kbCssPanel && kbCssPanel.setStyleSheets(e.styleSheets);
            }),
            topic.subscribe("dom/view", function (e) {
                kbHtmlViewer.view(e.target, e.skips);
            }),
            topic.subscribe("dom/click", function (e) {
                var el = e.target;
                kbInlineMenu.set("el", el);
                var box = domGeom.getMarginSize(kbInlineMenu.domNode),
                    doc = el.ownerDocument,
                    bodyWidth = doc.documentElement.clientWidth,
                    bodyHeight = doc.documentElement.clientHeight,
                    range = 30,
                    x = e.clientX + range,
                    y = e.clientY > range ? e.clientY - range : 1,
                    moveRange = 50,
                    minX, maxX, minY, maxY;

                if ((box.w + x) > bodyWidth) {
                    x = e.clientX - box.w - 20;
                }
                if ((box.h + y) > bodyHeight) {
                    y = e.clientY - box.h;
                }
                minX = x - moveRange, maxX = x + box.w + moveRange, minY = y - moveRange, maxY = y + box.h + moveRange;
                //kbInlineMenu和iframe刚好相对于同一个DIV容器来定位
                kbInlineMenu.show(x, y);
                _hideInlineMenuHandler && _hideInlineMenuHandler.remove();
                _hideInlineMenuHandler = topic.subscribe("dom/mousemove", function (e) {
                    if (e.clientX < minX ||
                        e.clientX > maxX ||
                        e.clientY < minY ||
                        e.clientY > maxY) {
                        _hideInlineMenuHandler.remove();
                        kbInlineMenu.hide();
                    }
                });

                var uuid = kbHtmlViewer.getUuid(el);
                kbHtmlViewer.select(uuid);
                kbHtmlViewer.scrollTo(uuid);
            }),
            topic.subscribe("dom/mouseover", function (e) {
                kbHtmlViewer.highlight(e.target);
            }),
            topic.subscribe("dom/mouseout", function (e) {
                kbHtmlViewer.unhighlight(e.target);
            }),
            topic.subscribe("dom/modified", function (e) {
                topic.publish("sandbox/remask");
                var uuid = kbHtmlViewer.getUuid(e.target);
                kbHtmlViewer.refresh(uuid);
            })
        ]);
    });

    handlers.push(on(win.global, "unload", function () {
        console.log("unload", handlers.length);
        var h;
        while (h = handlers.pop()) {
            h.remove();
        }
    }));
});