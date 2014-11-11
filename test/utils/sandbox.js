var sandbox = (function () {
    'use strict';

    var ID = 'sandbox';

    var $sandbox = $('<div></div>').attr('id', ID);
    $sandbox.appendTo(document.body);

    return {
        $: $sandbox,

        init: function (params) {
            $sandbox.textHighlighter(params);
            return sandbox.getHighlighter();
        },

        getHighlighter: function () {
            return $sandbox.getHighlighter();
        },

        empty: function () {
            $sandbox.empty();
            sandbox.getHighlighter().destroy();
        },

        html: function (removeMarkedAttr) {
            var html = $sandbox.html(),
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

            $sandbox.html(dom);

            marked = $sandbox.find('[data-marked]');

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
            $sandbox.contents().each(function getChildTextNodes() {
                if (this.nodeType === 3) {
                    textNodes.push(this);
                } else {
                    $(this).contents().each(getChildTextNodes);
                }
            });
            return textNodes;
        },

        addRange: function (startNode, endNode, startOffset, endOffset) {
            window.getSelection().removeAllRanges();

            var range = document.createRange();
            range.setStart(startNode, startOffset);
            range.setEnd(endNode, endOffset);
            window.getSelection().addRange(range);

            return range;
        }
    };
})();