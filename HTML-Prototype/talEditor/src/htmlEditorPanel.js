/**
 * Created by Raoh on 2014/9/17.
 */
require([
    "dojo/parser",
    "dojo/topic",
    "dojo/on",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dijit/registry",
    "dojo/domReady!"
], function (parser, topic, on, domStyle, domGeom, registry) {
    window.topic = topic;
    var kbSplitter, kbHtmlViewer,
        kbShade = dojo.byId("kbShade"),
        kbEmbedFrame = dojo.byId("kbEmbedFrame"),
        kbDragPane = dojo.byId("kbDragPane"),
        kbContainer;

    parser.parse().then(function () {
        kbSplitter = registry.byId("kbSplitter");
        kbHtmlViewer = registry.byId("kbHtmlViewer");
        kbContainer = kbSplitter.domNode.offsetParent;//TODO:容器高度是可变的

        kbSplitter.on("StartDrag", function () {
            domStyle.set(kbShade, "display", "block");
        });
        kbSplitter.on("Drag", function (top, height) {
            var box = domGeom.getMarginBox(kbContainer);
            domStyle.set(kbEmbedFrame, "height", top + "px");
            var h = box.h - top - height;
            domStyle.set(kbDragPane, {
                top: (top + height) + "px",
                height: (h < 0 ? 0 : h) + "px"
            });
        });
        kbSplitter.on("StopDrag", function () {
            domStyle.set(kbShade, "display", "none");
        });
        kbSplitter.on("Toggle", function (top, height) {
            var box = domGeom.getMarginBox(kbContainer);
            domStyle.set(kbEmbedFrame, "height", top + "px");
            var h = box.h - top - height;
            domStyle.set(kbDragPane, {
                top: (top + height) + "px",
                height: (h < 0 ? 0 : h) + "px"
            });
        });
        //TODO:layout
        on(window, "resize", function () {
            var splitterBox = domGeom.getMarginBox(kbSplitter.domNode),
                box = domGeom.getMarginBox(kbContainer);

            domStyle.set(kbEmbedFrame, "height", (box.h - splitterBox.h) + "px");
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
            kbHtmlViewer.view(e.refEl, e.skips);
        });
        topic.subscribe("dom/click", function (e) {
            var uuid = kbHtmlViewer.getUuid(e.refEl);
            kbHtmlViewer.select(uuid);
            kbHtmlViewer.scrollTo(uuid);
        });
        topic.subscribe("dom/mouseover", function (e) {
            kbHtmlViewer.highlight(e.refEl);
        });
        topic.subscribe("dom/mouseout", function (e) {
            kbHtmlViewer.unhighlight(e.refEl);
        });
        topic.subscribe("dom/modified", function (e) {
            kbHtmlViewer.refresh(e.uuid);
        });

        kbHtmlViewer.view(dojo.byId("header"));
    });
})