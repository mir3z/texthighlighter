var sandbox = (function () {
    'use strict';

    var ID = 'sandbox';

    function getWindow() {
        var doc = sandbox.$.get(0).ownerDocument;
        return doc.defaultView || doc.parentWindow;
    }

    return {
        $: null,

        render: function () {
            this.$ = $('<div></div>').attr('id', ID);
            return this.$;
        },

        init: function (params) {
            this.$.textHighlighter(params);
            return sandbox.getHighlighter();
        },

        getHighlighter: function () {
            return this.$.getHighlighter();
        },

        empty: function () {
            this.$.empty();
            sandbox.getHighlighter().destroy();
        },

        html: function (removeMarkedAttr) {
            var html = this.$.html(),
                wrapper;

            if (removeMarkedAttr) {
                wrapper = $('<div></div>').append(html);
                wrapper
                    .find('[data-marked]')
                    .removeAttr('data-marked');

                return wrapper.html();
            } else {
                return html;
            }
        },

        setFixture: function (name) {
            var dom = fixtures.get(name),
                marked,
                markings = {};

            this.$.html(dom);

            marked = this.$.find('[data-marked]');

            marked.each(function () {
                var value = $(this).data('marked');

                if (typeof markings[value] !== 'undefined') {
                    markings[value] = markings[value].add($(this));
                } else {
                    markings[value] = $(this);
                }

            });

            marked.removeAttr('data-marked');

            if (markings.true && Object.keys(markings).length === 1) {
                return markings.true;
            } else {
                return markings;
            }
        },

        getTextNodes: function () {
            var textNodes = [];
            this.$.contents().each(function getChildTextNodes() {
                if (this.nodeType === 3) {
                    textNodes.push(this);
                } else {
                    $(this).contents().each(getChildTextNodes);
                }
            });
            return textNodes;
        },

        addRange: function (startNode, endNode, startOffset, endOffset) {
            var selection = getWindow().getSelection();

            selection.removeAllRanges();

            var range = document.createRange();
            range.setStart(startNode, startOffset);
            range.setEnd(endNode, endOffset);

            // IE throws "Unspecified error" when trying to add range in some unusual places like <button> or
            // <style> elements. This will silence it.
            try {
                selection.addRange(range);
            } catch (e) {
                console.warn(e);
            }

            return range;
        }
    };
})();