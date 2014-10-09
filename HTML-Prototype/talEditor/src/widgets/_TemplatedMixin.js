/**
 * Created by Raoh on 2014/10/6.
 */
define([
    "dojo/cache",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dijit/_TemplatedMixin",
    "underscore"
], function (cache, declare, lang, domConstruct, _TemplatedMixin, _) {
    return declare([_TemplatedMixin], {
        _template: function (templateString) {
            return _.template(templateString, this);
        },
        buildRendering: function () {
            if (!this._rendered) {
                if (!this.templateString) {
                    this.templateString = cache(this.templatePath, {sanitize: true});
                }

                // Lookup cached version of template, and download to cache if it
                // isn't there already.  Returns either a DomNode or a string, depending on
                // whether or not the template contains ${foo} replacement parameters.
                var cached = _TemplatedMixin.getCachedTemplate(this.templateString, this._skipNodeCache, this.ownerDocument);

                var node;
                if (lang.isString(cached)) {
                    cached = this._template(cached);
                    node = domConstruct.toDom(this._stringRepl(cached), this.ownerDocument);
                    if (node.nodeType != 1) {
                        // Flag common problems such as templates with multiple top level nodes (nodeType == 11)
                        throw new Error("Invalid template: " + cached);
                    }
                } else {
                    // if it's a node, all we have to do is clone it
                    node = cached.cloneNode(true);
                }

                this.domNode = node;
            }

            // Call down to _WidgetBase.buildRendering() to get base classes assigned
            // TODO: change the baseClass assignment to _setBaseClassAttr
            this.inherited(arguments);

            if (!this._rendered) {
                this._fillContent(this.srcNodeRef);
            }

            this._rendered = true;
        }
    });
});
