/**
 * Created by Raoh on 2014/8/26.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojox/dtl/Inline",
    "dijit/_WidgetBase",
    "dojox/dtl/_Templated"
], function (declare, lang, Inline, _WidgetBase, _Templated) {
    return lang.extend(function (args, node) {
            this.create(args, node);
        },
        Inline.prototype,
        {
            buildRendering: function () {
                var div = this.domNode = document.createElement("div");
                var node = this.srcNodeRef;
                if (node.parentNode) {
                    node.parentNode.replaceChild(div, node);
                }

                this.template = new dojox.dtl.Template(lang.trim(node.innerHTML), true);
                this.render();
            }
        });
});