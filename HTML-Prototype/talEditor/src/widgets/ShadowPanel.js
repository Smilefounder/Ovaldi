define([
    "dojo/_base/declare",
    "dojo/has",
    "dojo/sniff",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/ShadowPanel.html"
], function (declare, has, sniff, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        baseClass: "kb-shadow-panel",
        templateString: template,
        labelEnableShadow: "Enable shadow",
        labelDirection: "Direction",
        labelDistance: "Distance",
        labelBlur: "Blur",
        labelColor: "Color",
        labelOpacity: "Opacity",
        directionSpinner: null,
        distanceSpinner: null,
        blurSpinner: null,
        colorBox: null,
        opacitySlider: null,
        css: function (css) {

        },
        reset:function(){

        },
        destroy: function () {
            this.inherited(arguments);
            delete this.directionSpinner;
            delete this.distanceSpinner;
            delete this.blurSpinner;
            delete this.colorBox;
            delete this.opacitySlider;
        }
    });
});
