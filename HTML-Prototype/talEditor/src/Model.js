/**
 * Created by Raoh on 2014/11/4.
 */
define([
    "dojo/Evented",
    "dojo/_base/declare",
    "dijit/Destroyable"
], function (Evented, declare, Destroyable) {
    return declare([Evented, Destroyable], {
        on: function (type, listener) {
            return this.own(this.inherited(arguments))[0];
        },
        emit: function (/*String*/ type, /*Object?*/ eventObj) {
            if (this._started && !this._beingDestroyed) {
                this.inherited(arguments);
            }
        },
        destroy: function () {
            this._beingDestroyed = true;
            this.inherited(arguments);
        }
    });
});