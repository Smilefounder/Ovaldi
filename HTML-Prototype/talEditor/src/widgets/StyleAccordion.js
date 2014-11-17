/**
 * Created by Raoh on 2014/10/10.
 */
define([
    "dojo/_base/declare",
    "dojo/dom-style",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "./_DialogMixin",
    "dojo/text!./templates/StyleAccordion.html",
    "tal/widgets/BoxPanel",
    "tal/widgets/BackgroundPanel",
    "tal/widgets/BorderPanel",
    "tal/widgets/CornerPanel",
    "tal/widgets/ShadowPanel",
    "tal/widgets/FontPanel"
], function (declare, domStyle, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _DialogMixin, template) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _DialogMixin], {
        baseClass: "kb-style-accordion",
        templateString: template,
        box: null,
        background: null,
        border: null,
        corner: null,
        shadow: null,
        font: null,
        cs: null,
        buildRendering: function () {
            this.inherited(arguments);
            var self = this;
            $(this.containerNode).accordion({
                heightStyle: 'content',
                collapsible: true,
                active: 0,
                beforeActivate: function () {
                    self.cs && self.css(self.cs);
                }
            })
        },
        startup: function () {
            this.inherited(arguments);
            var self = this;

            function _onChange(css) {
                self.onChange(css);
            }

            this.box.on("change", _onChange);
            this.background.on("change", _onChange);
            this.border.on("change", _onChange);
            this.corner.on("change", _onChange);
            this.shadow.on("change", _onChange);
            this.font.on("change", _onChange);
            this.background.callback = function () {
                $.pop({
                    url: "/Contents/MediaContent/Selection?siteName=Test&UUID=Test&return=%2FSites%2FView%3FsiteName%3DTest&listType=grid&SingleChoice=true",
                    width: 900,
                    height: 500,
                    dialogClass: 'kb-dialog kb-iframe-dialog',
                    frameHeight: '100%',
                    onload: function (handle, pop, config) {
                        window.onFileSelected = function (src, text) {
                            self.background.src(src);
                        };
                    }
                });
            }
        },
        css: function (css) {
            if (css) {
                this.cs = css;
                this.box.css(css);
                this.background.css(css);
                this.border.css(css);
                this.corner.css(css);
                this.shadow.css(css);
                this.font.css(css);
            }
        },
        reset: function () {
            this.box.reset();
            this.background.reset();
            this.border.reset();
            this.corner.reset();
            this.shadow.reset();
            this.font.reset();
        },
        onChange: function (css) {
        },
        onClose: function () {
            this.reset();
        },
        destroy: function () {

        }
    });
});
