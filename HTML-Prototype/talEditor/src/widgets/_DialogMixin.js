/**
 * Adapter for jQuery UI Dialog
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang"
], function (declare, lang) {
    return declare([], {
        labelDialogTitle: "Background Image",
        autoOpen: false,
        resizable: false,
        width: 400,
        startup: function () {
            this.inherited(arguments);
            $(this.domNode).dialog({
                autoOpen: false,
                dialogClass: 'kb-inline-dialog',
                title: this.labelDialogTitle,
                resizable: this.resizable,
                width: this.width,
                open: lang.hitch(this, function () {
                    this.onOpen();
                }),
                beforeClose: lang.hitch(this, function () {
                    this.onBeforeClose();
                }),
                close: lang.hitch(this, function () {
                    this.onClose();
                })
            });
        },
        isOpen: function () {
            return $(this.domNode).dialog("isOpen");
        },
        open: function () {
            $(this.domNode).dialog("open");
        },
        close: function () {
            $(this.domNode).dialog("close");
        },
        onOpen: function () {
        },
        onBeforeClose: function () {
        },
        onClose: function () {
        },
        destroy: function () {
            $(this.domNode).dialog("destroy");
            this.inherited(arguments);
        }
    })
});
