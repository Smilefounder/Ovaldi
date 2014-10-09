/**
 * Created by Raoh on 2014/10/4.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "./ImagePanel",
    "./_DialogMixin",
    "dojo/i18n!./nls/ImageDialog"
], function (declare, lang, ImagePanel, _DialogMixin, res) {
    return declare([ImagePanel,_DialogMixin], {
        baseClass: "kb-image-dialog",
        labelDialogTitle: "Image",
        width: 400,
        postMixInProperties: function () {
            lang.mixin(this, res);
            this.inherited(arguments);
        }
    });
});