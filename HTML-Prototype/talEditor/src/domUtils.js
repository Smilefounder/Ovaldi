/**
 * Created by Administrator on 2014-10-25.
 */
define([
    "dojo/_base/window"
], function (win) {
    return {
        select: function (startNode, startOffset, endNode, endOffset) {
            var len = arguments.length,
                w = win.global,
                doc = win.doc,
                body = win.body();
            if (w.getSelection) {
                var sel = w.getSelection(), range = doc.createRange();

                //selectNode：设置Range的范围，包括节点本身和它的所有后代(子孙)节点。
                //selectNodeContents：设置Range的范围，包括它的所有后代节点（不包括节点本身）。
                if (len == 1) {
                    range.selectNodeContents(startNode);
                } else {
                    range.setStart(startNode, startOffset);
                    range.setEnd(endNode, endOffset);
                }
                sel.removeAllRanges();
                sel.addRange(range);
            }
            else if (body.createTextRange) {
                //TODO:处理IE
                //range = body.createTextRange();
                //range.moveToElementText(startNode);
                //range.select();
            }
        },
        unselect: function () {
            var w = win.global, doc = win.doc;
            if (w.getSelection) {
                var sel = w.getSelection();
                sel.removeAllRanges();
            } else if (doc.selection) {
                doc.selection.empty();
            }
        },
        findNextDown: function (node, criteria) {
            if (!node)
                return null;

            for (var child = node.firstChild; child; child = child.nextSibling) {
                if (criteria(child))
                    return child;

                var next = this.findNextDown(child, criteria);
                if (next)
                    return next;
            }
        },
        findNext: function (node, criteria, root) {
            if (!node) {
                return null;
            }
            for (var sib = node.nextSibling; sib; sib = sib.nextSibling) {
                if (criteria(sib))
                    return sib;

                var next = this.findNextDown(sib, criteria);
                if (next)
                    return next;
            }
            if (node.parentNode && node.parentNode != root) {
                return this.findNext(node.parentNode, criteria, root);
            }
            return null;
        }
    };
});
