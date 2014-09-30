/**
 * Created by Raoh on 2014/9/25.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom-geometry",
    "dojo/dom-construct",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "./_Splitter",
    "dojo/text!./templates/SplitContainer.html"
], function (declare, array, lang, domAttr, domStyle, domGeom, domConst, _WidgetBase, _TemplatedMixin, Splitter, template) {
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
        constructor: function () {
            dojo.safeMixin(this, arguments);
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
        },
        _setupChild: function (el) {
            el.style.position = "absolute";
        },
        _setupSplitter: function () {
            this._splitterRef = new Splitter({
                container: this,
                dock: this.dock
            });
            domConst.place(this._splitterRef.domNode, this.containerNode);//place at last
            this._splitterRef.startup();

            var dir = this.horizontal ? "h" : "w",
                attr = this.horizontal ? "height" : "width";
            this._splitterRef.on("StartDrag", lang.hitch(this, function (e) {
                domStyle.set(this.coverNode, "display", "block");
            }));
            this._splitterRef.on("StopDrag", lang.hitch(this, function (e) {
                domStyle.set(this.coverNode, "display", "none");
            }));
            this._splitterRef.on("Drag", lang.hitch(this, function (topOrLeft, widthOrHeight) {
                domStyle.set(this.panel1, attr, topOrLeft + "px");
                domStyle.set(this.panel2, attr, (this._contentBox[dir] - topOrLeft - widthOrHeight) + "px");
                this.layout();
            }));
            this._splitterRef.on("Toggle", lang.hitch(this, function (topOrLeft, widthOrHeight) {
                domStyle.set(this.panel1, attr, topOrLeft + "px");
                domStyle.set(this.panel2, attr, (this._contentBox[dir] - topOrLeft - widthOrHeight) + "px");
                this.layout();
            }));
        },
        toggle: function () {
            this._splitterRef._toggle();
        },
        resize: function () {
            this._contentBox = domGeom.getContentBox(this.containerNode);
            var isHorizontal = this.horizontal,
                dim = isHorizontal ? "h" : "w",
                attr = isHorizontal ? "height" : "width",
                thickness = domStyle.get(this._splitterRef.domNode, attr),
                spaceAvailable = this._contentBox[dim] - thickness,
                panel1Box = domGeom.getMarginBox(this.panel1),
                panel2Box = domGeom.getMarginBox(this.panel2),
                wh1 = spaceAvailable / (panel1Box[dim] + panel2Box[dim]) * panel1Box[dim],
                wh2 = spaceAvailable / (panel1Box[dim] + panel2Box[dim]) * panel2Box[dim];

            domStyle.set(this.panel1, attr, wh1 + "px");
            domStyle.set(this.panel2, attr, wh2 + "px");

            this.layout();
        },
        layout: function () {
            var isHorizontal = this.horizontal,
                dim = isHorizontal ? "h" : "w",
                attr = isHorizontal ? "height" : "width",
                contentBox = this._contentBox,
                thickness = domStyle.get(this._splitterRef.domNode, attr),
                panel1Box = domGeom.getMarginBox(this.panel1),
                wh1 = panel1Box[dim];

            domStyle.set(this.panel1, {
                left: contentBox.l + "px",
                top: contentBox.t + "px"
            });

            domStyle.set(this._splitterRef.domNode, {
                left: contentBox.l + "px",
                top: (contentBox.t + wh1) + "px"
            });
            domStyle.set(this.panel2, {
                left: contentBox.l + "px",
                top: (contentBox.t + wh1 + thickness) + "px"
            });
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