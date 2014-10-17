/**
 * Created by Raoh on 2014/10/11.
 */
define([
    "dojo/_base/declare"
], function (declare) {
    return declare([], {
        menu: null,
        text: null,
        constructor: function (menu) {
            this.menu = menu;
        },
        visibility:function(){
            return true;
        },
        callback:function(){
            this.menu.hide();
        }
    })
});
