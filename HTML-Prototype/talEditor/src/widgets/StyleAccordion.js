/**
 * Created by Raoh on 2014/10/10.
 */
define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "./_DialogMixin",
    "dojo/text!./templates/StyleAccordion.html"
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _DialogMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _DialogMixin], {
        baseClass: "kb-style-accordion",
        templateString: template,
        buildRendering: function () {
            this.inherited(arguments);
            $(this.containerNode).accordion({
                heightStyle: 'content'
            })
        }
    });
});
