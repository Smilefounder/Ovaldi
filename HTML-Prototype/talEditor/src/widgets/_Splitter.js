/**
 * Created by Raoh on 2014/9/9.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/touch",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/Splitter.html"
], function (declare, lang, on, touch, domStyle, domClass, geom, _WidgetBase, _TemplatedMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-splitter",
        declaredClass: "kbSplitter",
        templateString: template,
        container: null,
        spriteNode: null,
        horizontal: true,
        docked: false,
        size: 5,
        dock: null,//vertical:"top"/"bottom",horizontal:"left"/"right"
        lastPoint: null,
        constructor: function () {
            this.inherited(arguments);
            this._handlers = [];
        },
        startup: function () {
            this.own(on(this.spriteNode, touch.press, function (e) {
                e.stopPropagation();
            }));
        },
        toggle: function () {
            var isHorizontal = this.horizontal,
                attr = isHorizontal ? "width" : "height",
                splitterAttr = isHorizontal ? "left" : "top",
                dim = isHorizontal ? "w" : "h",
                point = geom.getMarginBox(this.domNode)[isHorizontal ? "l" : "t"],
                contentBox = geom.getContentBox(this.container.containerNode),
                pos, ret;

            if (this.docked) {
                this.set("docked", false);
                domStyle.set(this.domNode, attr, this.size + "px");
                if (this.lastPoint >= this.container._contentBox[dim]) {
                    this.set("lastPoint", Math.round(this.container._contentBox[dim] / 2));
                }
                domStyle.set(this.domNode, splitterAttr, this.lastPoint + "px");
                ret = [this.lastPoint, this.size];
            } else {
                this.set("docked", true);
                switch (this.dock) {
                    case "left":
                        pos = contentBox.l;
                        break;
                    case "right":
                        pos = contentBox.w;
                        break;
                    case "top":
                        pos = contentBox.t;
                        break;
                    case "bottom":
                        pos = contentBox.h;
                        break;
                }
                this.set("lastPoint", point);
                domStyle.set(this.domNode, attr, "0px");//hide the splitter width/height
                domStyle.set(this.domNode, splitterAttr, pos + "px");
                ret = [pos, 0];
            }
            this.emit("Toggle", {}, ret);
        },
        _toggle: function (e) {
            this.toggle();
            e.stopPropagation();
            e.preventDefault();
        },
        _setDockAttr: function (dock) {
            this._set("dock", dock);
            domClass[this.dock ? "add" : "remove"](this.spriteNode, ["toggle-button", "toggle-to-" + this.dock]);
        },
        _setDockedAttr: function (docked) {
            this._set("docked", docked);
            domClass[docked ? "remove" : "add"](this.spriteNode, "active");
        },
        _startDrag: function (e) {
            var de = this.ownerDocument,
                isHorizontal = this.horizontal,
                axis = isHorizontal ? "pageX" : "pageY",
                attr = isHorizontal ? "width" : "height",
                splitterAttr = isHorizontal ? "left" : "top",
                contentPos = geom.position(this.container.containerNode),
                offset = contentPos[isHorizontal ? "x" : "y"],
                contentBox = geom.getContentBox(this.container.containerNode),
                min = contentBox[isHorizontal ? "l" : "t"],//minimum left/ minimum top
                max = contentBox[isHorizontal ? "w" : "h"] - this.size;//maximum left/maximum top

            this._handlers = this._handlers.concat([
                on(de, touch.move, lang.hitch(this, function (e) {
                    var pos = Math.min(Math.max(e[axis] - offset, min), max);
                    domStyle.set(this.domNode, splitterAttr, pos + "px");
                    this.emit("Drag", e, [pos, this.size]);
                })),
                on(de, "dragstart", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                }),
                on(this.ownerDocumentBody, "selectstart", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                }),
                on(de, touch.release, lang.hitch(this, "_stopDrag"))
            ]);
            this.emit("StartDrag", e, []);
            e.stopPropagation();
            e.preventDefault();
        },
        _stopDrag: function (e) {
            this._cleanupHandlers();
            this.emit("StopDrag", e, []);
            e.stopPropagation();
            e.preventDefault();
        },
        _cleanupHandlers: function () {
            var h;
            while (h = this._handlers.pop()) {
                h.remove();
            }
        },
        _onMouse: function (e) {
            var o = (e.type == "mouseover" || e.type == "mouseenter");
        },
        onStartDrag: function () {/*Stub*/
        },
        onDrag: function (leftOrTop, widthOrHeight) {/*Stub*/
        },
        onStopDrag: function () {/*Stub*/
        },
        onToggle: function (/*left/top*/leftOrTop, /*width/height*/widthOrHeight) {/*Stub*/
        },
        destroy: function () {
            this.inherited(arguments);
            this._cleanupHandlers();
            delete this.spriteNode;
        }
    });
});