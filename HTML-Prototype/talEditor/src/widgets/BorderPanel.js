/**
 * Created by Raoh on 2014/9/30.
 */
define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/BorderPanel.html"
], function (declare, _WidgetBase, _TemplatedMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-border-panel",
        templateString: template,
        labelWidth: "Width",
        labelStyle: "Style",
        labelColor: "Color",
        labelOpacity: "Opacity",
        widthNode: null,
        styleNode: null,
        colorNode: null,
        opacityNode: null,
        _initUI: function () {
            $(".J_Spinner", this.domNode).spinner({
                min: 0
            });
        },
        _getWidthAttr: function () {
            return this.widthNode.value;
        },
        _setWidthAttr: function (width) {
            this.widthNode.value = width;
        },
        _getStyleAttr: function () {
            return this.styleNode.value;
        },
        _setStyleAttr: function (style) {
            this.styleNode.value = style;
        },
        _getColorAttr: function () {
            return this.colorNode.value;
        },
        _setColorAttr: function (color) {

        },
        _getOpacity: function () {

        },
        _setOpacity: function (opacity) {

        }
    });
});
