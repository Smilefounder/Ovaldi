/**
 * Created by Raoh on 2014/9/30.
 */
define([
    "dojo/_base/declare",
    "dojo/dom-style",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin"
], function (declare, domStyle, _WidgetBase, _TemplatedMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-corner-panel",
        templateString: template,
        tlNode: null,
        trNode: null,
        blNode: null,
        brNode: null,
        //TODO:边角效果能否仅在一个DIV中实现
        setCorner: function (corner) {
            var node;
            for (var p in corner) {
                node = this[p + "Node"];
                if (node) {
                    node.value = corner[p];
                    //TODO:实时效果，注意要加"px"后缀
                }
            }
        },
        getCorner: function () {
            return {
                tl: this.tlNode.value,
                tr: this.trNode.value,
                bl: this.blNode.value,
                br: this.brNode.value
            };
        },
        destroy:function(){
            this.inherited(arguments);
            delete this.tlNode;
            delete this.trNode;
            delete this.blNode;
            delete this.brNode;
        }
    });
});
