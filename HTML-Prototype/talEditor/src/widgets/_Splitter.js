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
        horizontal: true,//horizontal(true) or vertical(false), default is true
        docked: false,
        dock: null,//horizontal:"top"/"bottom",vertical:"left"/"right"
        lastPoint: null,
        constructor: function () {
            this.inherited(arguments);
            this._handlers = [];
        },
        postCreate: function () {
            this.inherited(arguments);
            domStyle.set(this.spriteNode, "display", this.dock ? "block" : "none");
        },
        toggle: function () {
            var isHorizontal = this.horizontal,
                attr = isHorizontal ? "height" : "width",
                splitterAttr = isHorizontal ? "top" : "left",
                thickness = 5,
                dim = isHorizontal?"h":"w",
                point = geom.getMarginBox(this.domNode)[isHorizontal?"t":"l"],
                contentBox = geom.getContentBox(this.container.containerNode),
                pos, ret;

            if (this.docked) {
                this.set("docked", false);
                domStyle.set(this.domNode, attr, thickness + "px");
                if (this.lastPoint >= this.container._contentBox[dim]) {
                    this.set("lastPoint", Math.round(this.container._contentBox[dim] / 2));
                }
                domStyle.set(this.domNode, splitterAttr, this.lastPoint + "px");
                ret = [this.lastPoint, thickness];
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
        _setDockedAttr: function (docked) {
            this._set("docked", docked);
            var cls = "";
            switch (this.dock) {
                case "left":
                    cls = "";
                    break;
                case "right":
                    cls = "";
                    break;
                case "top":
                    cls = "";
                    break;
                case "bottom":
                    cls = "";
                    break;
            }
            domClass.add(this.domNode, cls);
        },
        _startDrag: function (e) {
            var de = this.ownerDocument,
                isHorizontal = this.horizontal,
                axis = isHorizontal ? "pageY" : "pageX",
                splitterAttr = isHorizontal ? "top" : "left",
                thickness = domStyle.get(this.domNode, isHorizontal ? "height" : "width"),
                contentPos = geom.position(this.container.containerNode),
                offset = contentPos[isHorizontal ? "y" : "x"],
                contentBox = geom.getContentBox(this.container.containerNode),
                min = contentBox[isHorizontal ? "t" : "l"],//minimum left/ minimum top
                max = contentBox[isHorizontal ? "h" : "w"] - thickness;//maximum left/maximum top

            this._handlers = this._handlers.concat([
                on(de, touch.move, lang.hitch(this, function (e) {
                    var pos = Math.min(Math.max(e[axis] - offset, min), max);
                    domStyle.set(this.domNode, splitterAttr, pos + "px");
                    this.emit("Drag", e, [pos, thickness]);
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