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
                    .find('[data-marked=true]')
                    .removeAttr('data-marked');

                return wrapper.html();
            } else {
                return html;
            }
        },

        setFixture: function (name) {
            var dom = fixtures.get(name);

            $sandbox.append(dom);
            return $sandbox.find('[data-marked=true]').removeAttr('data-marked');
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
        }
    };
})();