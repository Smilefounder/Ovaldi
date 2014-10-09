/**
 * Created by Raoh on 2014/9/30.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-attr",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/BackgroundImagePanel.html",
    "dojo/i18n!./nls/BackgroundImagePanel"
], function (declare, lang, domAttr, _WidgetBase, _TemplatedMixin, template, res) {
    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: "kb-background-image-panel",
        templateString: template,
        labelRepeated: "Repeated",
        labelPositionX: "Position X",
        labelPositionY: "Position Y",
        labelSrc: "Image",
        labelClearSrc: "Clear",
        buttonChange: "Change image",
        srcNode: null,
        repeatedNode: null,
        positionXNode: null,
        positionYNode: null,
        postMixInProperties: function () {
            lang.mixin(this, res);
            this.inherited(arguments);
        },
        _initUI: function () {
            $(".J_Spinner", this.domNode).spinner({
                min: 0
            });
        },
        startup: function () {
            this.inherited(arguments);
            this._initUI();
        },
        _getSrcAttr: function () {
            return this.srcNode.value;
        },
        _setSrcAttr: function (src) {
            domAttr.set(this.srcNode, "src", src);
        },
        _getRepeatedAttr: function () {
            return this.repeatedNode.value;
        },
        _setRepeatedAttr: function (repeated) {
            this.repeatedNode.value = repeated;
        },
        _getPositionXAttr: function () {
            return this.positionXNode.value;
        },
        _setPositionXAttr: function (positionX) {
            this.positionXNode.value = positionX;
        },
        _getPositionYAttr: function () {
            return this.positionYNode.value;
        },
        _setPositionYAttr: function (positionY) {
            this.positionYNode.value = positionY;
        },
        _onChange: function (e) {
            this.emit("Change");
        },
        onChange: function () {
        },
        _clearSrc: function () {
            this.set("src", "");
        }
    });
});