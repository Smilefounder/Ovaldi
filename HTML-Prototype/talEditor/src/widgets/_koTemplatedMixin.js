/**
 * Created by Raoh on 2014/8/12.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
    "dijit/_TemplatedMixin",
    "ko"
], function (declare, lang, aspect, _TemplatedMixin, ko) {
    /*aspect.before(_AttachMixin.prototype, "buildRendering", function () {
     if (this.domNode) {
     ko.applyBindings(this, this.domNode);
     }
     });*/

    return declare([_TemplatedMixin], {
        buildRendering: function () {
            this.inherited(arguments);
            ko.applyBindings(this, this.domNode);
        }
    });
});