/**
 * Created by Raoh on 2014/10/17.
 */
define([
    "dojo/on",
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/Spinner.html"
], function (on, lang, declare, _WidgetBase, _TemplatedMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-spinner",
        templateString: template,
        min: 0,
        value: 0,
        textbox: null,
        buildRendering: function () {
            this.inherited(arguments);
            var self = this;
            $(this.textbox).spinner({
                min: this.min,
                create: function () {
                    this.value = self.value;
                },
                stop: function () {
                    self.set("value", this.value);
                },
                change: function () {
                    self.set("value", this.value);
                }
            });
        },
        postCreate: function () {
            this.inherited(arguments);
            this.own([
                on(this.textbox, "paste", lang.hitch(this, function (e) {
                    var self = this;
                    setTimeout(function () {
                        self.set("value", parseFloat(self.textbox.value) || 0);
                    }, 0);
                })),
                on(this.textbox, "blur", lang.hitch(this, function (e) {
                    this.set("value", parseFloat(this.textbox.value) || 0);
                }))
            ]);
        },
        _setValueAttr: function (newValue) {
            if (this.value != newValue) {
                var n = parseFloat(newValue) || 0;
                this._set("value", n);
                this.textbox.value = this.value;
                this.onChange(this.value);
            }
        },
        onChange: function (newValue) {
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.textbox;
        }
    });
});
