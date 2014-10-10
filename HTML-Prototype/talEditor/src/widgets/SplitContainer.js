/**
 * Created by Raoh on 2014/9/25.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/dom-construct",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/Viewport",
    "./_Splitter",
    "dojo/text!./templates/SplitContainer.html"
], function (declare, array, lang, domAttr, domStyle, domClass, domGeom, domConst, _WidgetBase, _TemplatedMixin, Viewport, Splitter, template) {
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-split-container",
        templateString: template,
        class: null,
        style: null,
        panel1: null,
        panel2: null,
        coverNode: null,
        horizontal: true,
        dock: null,//"left","right","top","bottom"
        docked: false,
        _splitterRef: null,
        constructor: function (params) {
            declare.safeMixin(this, params);
            this.inherited(arguments);
        },
        buildRendering: function () {
            this.inherited(arguments);
            var self = this;
            array.forEach(this.containerNode.children, function (child) {
                var region = domAttr.get(child, "data-kooboo-region");
                if (region) {
                    self[region] = child;
                    self._setupChild(child);
                }
            });
        },
        startup: function () {
            this._setupSplitter();
            this.inherited(arguments);
            this.resize();
            this.own(Viewport.on("resize", lang.hitch(this, "resize")));
        },
        _setHorizontalAttr: function (horizontal) {
            this._set("horizontal", horizontal);
            domClass[horizontal ? "add" : "remove"](this.domNode, "horizontal");
        },
        _setupChild: function (el) {
            el.style.position = "absolute";
            domClass.add(el, "kb-split-panel");
        },
        _setupSplitter: function () {
            this._splitterRef = new Splitter({
                container: this,
                horizontal: this.horizontal,
                dock: this.dock
            });
            domConst.place(this._splitterRef.domNode, this.containerNode);//place at last
            this._splitterRef.startup();

            var dir = this.horizontal ? "w" : "h",
                attr = this.horizontal ? "width" : "height";
            this._splitterRef.on("StartDrag", lang.hitch(this, function (e) {
                domStyle.set(this.coverNode, "display", "block");
            }));
            this._splitterRef.on("StopDrag", lang.hitch(this, function (e) {
                domStyle.set(this.coverNode, "display", "none");
            }));
            this._splitterRef.on("Drag", lang.hitch(this, function (topOrLeft, widthOrHeight) {
                domStyle.set(this.panel1, attr, topOrLeft + "px");
                domStyle.set(this.panel2, attr, (this._contentBox[dir] - topOrLeft - widthOrHeight) + "px");
                /*domGeom.setMarginBox(this.panel1,{h:topOrLeft});
                domGeom.setMarginBox(this.panel2,{h:this._contentBox[dir] - topOrLeft - widthOrHeight});*/
                this.layout();
            }));
            this._splitterRef.on("Toggle", lang.hitch(this, function (topOrLeft, widthOrHeight) {
                domStyle.set(this.panel1, attr, topOrLeft + "px");
                domStyle.set(this.panel2, attr, (this._contentBox[dir] - topOrLeft - widthOrHeight) + "px");
                this.layout();
            }));
        },
        toggle: function () {
            this._splitterRef.toggle();
        },
        resize: function () {
            var node = this.containerNode,
                mb = domGeom.getMarginBox(node),
                cs = domStyle.getComputedStyle(node),
                me = domGeom.getMarginExtents(node, cs),
                be = domGeom.getBorderExtents(node, cs),
                pe = domGeom.getPadExtents(node, cs),
                bb = (this._borderBox = {
                    w: mb.w - (me.w + be.w),
                    h: mb.h - (me.h + be.h)
                });

            this._contentBox = {
                l: domStyle.toPixelValue(node, cs.paddingLeft),
                t: domStyle.toPixelValue(node, cs.paddingTop),
                w: bb.w - pe.w,
                h: bb.h - pe.h
            };

            var isHorizontal = this.horizontal,
                dim = isHorizontal ? "w" : "h",
                attr = isHorizontal ? "width" : "height",
                thickness = domStyle.get(this._splitterRef.domNode, attr),
                spaceAvailable = this._contentBox[dim] - thickness,
                panel1Box = domGeom.getMarginBox(this.panel1),
                panel2Box = domGeom.getMarginBox(this.panel2),
                wh1 = Math.floor(spaceAvailable / (panel1Box[dim] + panel2Box[dim]) * panel1Box[dim]),
                wh2 = Math.round(spaceAvailable / (panel1Box[dim] + panel2Box[dim]) * panel2Box[dim]);

            //TODO:容器必须设置为overflow:hidden，否则，当容器内部包含子容器，缩小窗体时，父容器的滚动条会导致子层容器的大小计算错误


            domStyle.set(this.panel1, attr, wh1 + "px");
            domStyle.set(this.panel2, attr, wh2 + "px");

            this.layout();
        },
        layout: function () {
            var isHorizontal = this.horizontal,
                dim = isHorizontal ? "w" : "h",
                attr = isHorizontal ? "width" : "height",
                contentBox = this._contentBox,
                thickness = domStyle.get(this._splitterRef.domNode, attr),
                panel1Box = domGeom.getMarginBox(this.panel1),
                panel2Box = domGeom.getMarginBox(this.panel2),
                wh1 = panel1Box[dim],
                wh2 = panel2Box[dim];

            domStyle.set(this.panel1, {
                left: contentBox.l + "px",
                top: contentBox.t + "px"
            });

            if (isHorizontal) {
                domStyle.set(this._splitterRef.domNode, {
                    left: (contentBox.l + wh1) + "px",
                    top: contentBox.t + "px"
                });
                domStyle.set(this.panel2, {
                    left: (contentBox.l + wh1 + thickness) + "px",
                    top: contentBox.t + "px"
                });
            } else {

                domStyle.set(this._splitterRef.domNode, {
                    left: contentBox.l + "px",
                    top: (contentBox.t + wh1) + "px"
                });
                domStyle.set(this.panel2, {
                    left: contentBox.l + "px",
                    top: (contentBox.t + wh1 + thickness) + "px"
                });
            }

            domStyle.set(this.panel1, "overflow", wh1 <= 0 ? "hidden" : "");
            domStyle.set(this.panel2, "overflow", wh2 <= 0 ? "hidden" : "");
        },
        destroy: function () {
            this.inherited(arguments);
            this._splitterRef.destroy();
            delete this.coverNode;
            delete this.panel1;
            delete this.panel2;
        }
    });
});