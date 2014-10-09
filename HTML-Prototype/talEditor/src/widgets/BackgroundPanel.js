/**
 * Created by Raoh on 2014/10/8.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "./BackgroundImagePanel",
    "dojo/text!./templates/BackgroundPanel.html",
    "dojo/i18n!./nls/BackgroundPanel",
    "ko"
], function (declare, lang, BackgroundImagePanel, template, res, ko) {
    return declare([BackgroundImagePanel], {
        baseClass: "kb-background-panel",
        templateString: template,
        labelColor: "Color",
        labelOpacity: "Opacity",
        postMixInProperties: function () {
            lang.mixin(this, res);
            this.inherited(arguments);
        },
        _getColorAttr:function(){

        },
        _setColorAttr:function(color){

        },
        _getOpacityAttr:function(){

        },
        _setOpacityAttr:function(opacity){

        }
    });
});
