define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin"
],function(declare,_WidgetBase,_TemplatedMixin,template){
    return declare([_WidgetBase,_TemplatedMixin],{
        baseClass:"kb-position-panel",
        templateString:template,
        setPosition:function(){

        },
        setMargin:function() {

        },
        setBorder:function(){

        },
        setPadding:function(){

        },
        setSize:function(){

        }
    });
})
