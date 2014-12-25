/* global fixtures, $ */

/**
 * Manages test sandbox.
 * Sandbox is a specific div element to which highlighter is applied.
 * All tests are being performed within this element.
 * @global
 */
var sandbox = (function () {
    'use strict';

    var ID = 'sandbox';

    /**
     * Returns owner window of the sandbox.
     * This method is useful when sandbox is placed within an iframe.
     * @returns {Window}
     */
    function getWindow() {
        var doc = sandbox.el.ownerDocument;
        return doc.defaultView || doc.parentWindow;
    }

    return {
        /**
         * HTML object of the sandbox.
         * @type {HTMLElement}
         */
        el: null,

        /**
         * jQuery object of the sandbox.
         * @type {jQuery}
         */
        $el: null,

        /**
         * Renders sandbox and returns its HTML element.
         * @returns {HTMLElement}
         */
        render: function () {
            this.$el = $('<div></div>').attr('id', ID);
            this.el = this.$el.get(0);
            return this.el;
        },

        /**
         * Initializes sandbox.
         * Applies TextHighlighter to the sandbox and returns its instance.
         * Note: Sandbox must be already initialized.
         * @param {object} [params] - TextHighlighter options
         * @returns {object}
         */
        init: function (params) {
            this.$el.textHighlighter(params);
            return sandbox.getHighlighter();
        },

        /**
         * Returns highlighter instance.
         * Note: Sandbox must be already initialized.
         * @returns {object}
         */
        getHighlighter: function () {
            return this.$el.getHighlighter();
        },

        /**
         * Empties sandbox and destroys highlighter.
         */
        empty: function () {
            var hl = sandbox.getHighlighter();

            this.el.innerHTML = '';
            if (hl) {
                hl.destroy();
            }
        },

        /**
         * Returns sandbox's html
         * @param {boolean} [removeMarkedAttr] - if set to true, removes all 'marked' attributes.
         * @returns {string}
         */
        html: function (removeMarkedAttr) {
            var html = this.el.innerHTML,
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

        /**
         * Loads fixture in sandbox.
         * @param {string} name - fixture name
         * @returns {object} - marked nodes. Nodes in fixture can by marked in order to use them easily in test spec.
         */
        setFixture: function (name) {
            var dom = fixtures.get(name, false),
                marked,
                markings = {};

            this.$el.html(dom);

            marked = this.$el.find('[data-marked]');

            marked.each(function () {
                var value = $(this).data('marked');

                if (typeof markings[value] !== 'undefined') {
                    markings[value].push(this);
                } else {
                    markings[value] = [this];
                }

            });

            marked.removeAttr('data-marked');

            if (markings.true && Object.keys(markings).length === 1) {
                return markings.true;
            } else {
                return markings;
            }
        },

        /**
         * Returns array of text nodes of within the sandbox.
         * @returns {Array}
         */
        getTextNodes: function () {
            var textNodes = [];
            this.$el.contents().each(function getChildTextNodes() {
                if (this.nodeType === 3) {
                    textNodes.push(this);
                } else {
                    $(this).contents().each(getChildTextNodes);
                }
            });
            return textNodes;
        },

        /**
         * Adds DOM Range to the sandbox.
         * @param {Node} startNode
         * @param {Node} endNode
         * @param {number} startOffset
         * @param {number} endOffset
         * @returns {Range}
         */
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