define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/FontPanel.html"
], function (declare, _WidgetBase, _TemplatedMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-font-panel",
        templateString: template,
        familyNode: null,
        sizeNode: null,
        blurNode: null,
        colorPickerRef: null,
        _getFamilyAttr:function(){
            return this.familyNode.value;
        },
        _setFamilyAttr: function (family) {
            this.familyNode.value = family;
        },
        _getSizeAttr:function(){
            return this.sizeNode.value;
        },
        _setSizeAttr:function(size){
            return this.sizeNode.value=size;
        },
        _getColorAttr:function(){
            return this.colorPickerRef.get("value");
        },
        _setColorAttr:function(color){
            this.colorPickerRef.set("value",color);
        }
    });
});