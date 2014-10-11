define([
    "dojo/on",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/text!./templates/FontPanel.html"
], function (on, declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        baseClass: "kb-font-panel",
        templateString: template,
        labelFontFamily: "Family",
        labelFontSize: "Size",
        labelFontColor: "Color",
        familyNode: null,
        sizeSpinner: null,
        colorBox: null,
        startup: function () {
            this.inherited(arguments);
            var self = this;

            function _onChange() {
                self.onChange(self.css());
            }

            this.own([
                on(this.familyNode, "change", _onChange),
                this.sizeSpinner.on("change", _onChange),
                this.colorBox.on("change", _onChange)
            ]);
        },
        css: function (css) {
            if (css) {
                this.familyNode.value = css["font-family"] || "";
                this.sizeSpinner.set("value", css["font-size"] || "");
                this.colorBox.set("value", css["color"] || "");
            }
            else {
                return {
                    "font-family": this.familyNode.value,
                    "font-size": this.sizeSpinner.get("value"),
                    "color": this.colorBox.get("value")
                };
            }
        },
        onChange: function (css) {
        },
        destroy: function () {
            this.inherited(arguments);
            delete this.familyNode;
            delete this.sizeSpinner;
            delete this.colorBox;
        }
    });
});