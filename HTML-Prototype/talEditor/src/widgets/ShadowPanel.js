define([
    "dojo/_base/declare",
    "dojo/has",
    "dojo/sniff",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/ShadowPanel.html"
], function (declare, has, sniff, _WidgetBase, _TemplatedMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-shadow-panel",
        templateString: template,
        labelEnableShadow: "Enable shadow",
        labelDirection: "Direction",
        labelBlur: "Blur",
        labelColor: "Color",
        labelOpacity: "Opacity",
        directionNode: null,
        distanceNode: null,
        blurNode: null,
        colorPickerRef: null,
        setShadow: function (shadow) {

            if (has("ie")) {//ie,ff,chrome

            }
        },
        getShadow: function () {

        },
        destroy: function () {
            this.inherited(arguments);
            delete this.directionNode;
            delete this.distanceNode;
            delete this.blurNode;
        }
    });
});
