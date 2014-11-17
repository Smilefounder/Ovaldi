define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "./BackgroundImagePanel",
    "./_DialogMixin"
], function (declare, lang, BackgroundImagePanel, _DialogMixin) {
    return declare([BackgroundImagePanel, _DialogMixin], {
        baseClass: "kb-background-image-dialog",
        labelDialogTitle: "Background Image",
        width:400,
        onClose:function(){
            this.reset();
        }
    });
});