/* global jQuery */

/**
 * @license jQuery Text Highlighter
 * Copyright (c) 2011 - 2014 by mirz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function ($) {
    'use strict';

    var PLUGIN = {
        name: 'textHighlighter'
    };

    var DATA_ATTR = 'data-highlighted',
        NODE_TYPE = {
            ELEMENT_NODE: 1,
            TEXT_NODE: 3
        },
        IGNORE_TAGS = [
            'SCRIPT', 'STYLE', 'SELECT', 'OPTION', 'BUTTON', 'OBJECT', 'APPLET', 'VIDEO', 'AUDIO', 'CANVAS', 'EMBED',
            'PARAM', 'METER', 'PROGRESS'
        ];

    function color($el) {
        return $el.css('background-color');
    }

    function haveSameColor($a, $b) {
        return color($a) === color($b);
    }

    function normalizeTextNodes(el) {
        if (!el) { return; }

        if (el.nodeType === NODE_TYPE.TEXT_NODE) {
            while (el.nextSibling && el.nextSibling.nodeType === NODE_TYPE.TEXT_NODE) {
                el.nodeValue += el.nextSibling.nodeValue;
                el.parentNode.removeChild(el.nextSibling);
            }
        } else {
            normalizeTextNodes(el.firstChild);
        }
        normalizeTextNodes(el.nextSibling);
    }

    function refineRangeBoundaries(range) {
        var startContainer = range.startContainer,
            endContainer = range.endContainer,
            ancestor = range.commonAncestorContainer,
            goDeeper = true;

        if (range.endOffset === 0) {
            while (!endContainer.previousSibling && endContainer.parentNode !== ancestor) {
                endContainer = endContainer.parentNode;
            }
            endContainer = endContainer.previousSibling;
        } else if (endContainer.nodeType === NODE_TYPE.TEXT_NODE) {
            if (range.endOffset < endContainer.nodeValue.length) {
                endContainer.splitText(range.endOffset);
            }
        } else if (range.endOffset > 0) {
            endContainer = endContainer.childNodes.item(range.endOffset - 1);
        }

        if (startContainer.nodeType === NODE_TYPE.TEXT_NODE) {
            if (range.startOffset === startContainer.nodeValue.length) {
                goDeeper = false;
            } else if (range.startOffset > 0) {
                startContainer = startContainer.splitText(range.startOffset);
                if (endContainer === startContainer.previousSibling) {
                    endContainer = startContainer;
                }
            }
        } else if (range.startOffset < startContainer.childNodes.length) {
            startContainer = startContainer.childNodes.item(range.startOffset);
        } else {
            startContainer = startContainer.nextSibling;
        }

        return {
            startContainer: startContainer,
            endContainer: endContainer,
            goDeeper: goDeeper
        };
    }

    // ------------------------------------------------------------------------------------------------

    function TextHighlighter(element, options) {
        this.el = element;
        this.$el = $(element);
        this.options = $.extend({}, $[PLUGIN.name].defaults, options);

        this.$el.addClass(this.options.contextClass);
        this.bindEvents();
    }

    TextHighlighter.prototype.destroy = function () {
        this.unbindEvents();
        this.$el.removeClass(this.options.contextClass);
        this.$el.removeData(PLUGIN.name);
    };

    TextHighlighter.prototype.bindEvents = function () {
        this.$el.bind('mouseup', { self: this }, this.highlightHandler);
    };

    TextHighlighter.prototype.unbindEvents = function () {
        this.$el.unbind('mouseup', this.highlightHandler);
    };

    TextHighlighter.prototype.highlightHandler = function (event) {
        var hl = $(event.currentTarget).getHighlighter();
        hl.doHighlight();
    };

    TextHighlighter.prototype.doHighlight = function () {
        var range = this.getCurrentRange(),
            $wrapper,
            createdHighlights,
            normalizedHighlights;


        if (!range || range.collapsed) {
            return;
        }

        if (this.options.onBeforeHighlight(range) === true) {
            $wrapper = $.textHighlighter.createWrapper(this.options);

            createdHighlights = this.highlightRange(range, $wrapper);
            normalizedHighlights = this.normalizeHighlights(createdHighlights);

            this.options.onAfterHighlight(range.toString(), normalizedHighlights);
        }

        this.removeAllRanges();
    };

    TextHighlighter.prototype.getCurrentRange = function () {
        var selection = this.getCurrentSelection(),
            range;

        if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
        }

        return range;
    };

    TextHighlighter.prototype.removeAllRanges = function () {
        var selection = this.getCurrentSelection();
        selection.removeAllRanges();
    };

    TextHighlighter.prototype.getCurrentSelection = function () {
        return this.getCurrentWindow().getSelection();

//            if (currentWindow.getSelection) {
//                selection = currentWindow.getSelection();
//            } else if ($('iframe').length) {
//                $('iframe', top.document).each(function() {
//                    if (this.contentWindow === currentWindow) {
//                        selection = rangy.getIframeSelection(this);
//                        return false;
//                    }
//                });
//            } else {
//                selection = rangy.getSelection();
//            }
    };

    TextHighlighter.prototype.getCurrentWindow = function () {
        var currentDoc = this.getCurrentDocument();
        return currentDoc.defaultView;
    };

    TextHighlighter.prototype.getCurrentDocument = function () {
        // if ownerDocument is null then this.el is the document itself.
        return this.el.ownerDocument || this.el;
    };

    TextHighlighter.prototype.highlightRange = function (range, $wrapper) {
        if (!range || range.collapsed) {
            return [];
        }

        var result = refineRangeBoundaries(range),
            startContainer = result.startContainer,
            endContainer = result.endContainer,
            goDeeper = result.goDeeper,
            done = false,
            node = startContainer,
            highlights = [],
            highlight,
            nodeParent,
            wrapper;

        $wrapper.attr('data-highlighted', true);

        do {
            if (goDeeper && node.nodeType === NODE_TYPE.TEXT_NODE) {

                if (IGNORE_TAGS.indexOf(node.parentNode.tagName) === -1 && node.nodeValue.trim() !== '') {
                    wrapper = $wrapper.clone(true).get(0);
                    nodeParent = node.parentNode;

                    // highlight if node is inside the el
                    if ($.contains(this.el, nodeParent) || nodeParent === this.el) {
                        highlight = $(node).wrap(wrapper).parent().get(0);
                        highlights.push(highlight);
                    }
                }

                goDeeper = false;
            }
            if (node === endContainer && !(endContainer.hasChildNodes() && goDeeper)) {
                done = true;
            }

            if (node.tagName && IGNORE_TAGS.indexOf(node.tagName) > -1) {

                if (endContainer.parentNode === node) {
                    done = true;
                }
                goDeeper = false;
            }
            if (goDeeper && node.hasChildNodes()) {
                node = node.firstChild;
            } else if (node.nextSibling) {
                node = node.nextSibling;
                goDeeper = true;
            } else {
                node = node.parentNode;
                goDeeper = false;
            }
        } while (!done);

        return highlights;
    };

    TextHighlighter.prototype.normalizeHighlights = function (highlights) {
        var normalizedHighlights = [];

        this.flattenNestedHighlights(highlights);
        this.mergeSiblingHighlights(highlights);

        // omit removed nodes
        normalizedHighlights = $.map(highlights, function(hl) {
            return hl.parentElement ? hl : null;
        });

        normalizedHighlights = $.unique(normalizedHighlights);

        return normalizedHighlights;
    };

    TextHighlighter.prototype.flattenNestedHighlights = function (highlights) {

        var $highlights = highlights.sort(function (a, b) {
            return $(b).parents().length - $(a).parents().length;
        });

        var again,
            self = this;

        do {
            again = false;

            $.each($highlights, function (i) {
                var $hl = $(this);
                var hl = this;
                var $parent = $hl.parent();
                var $parentPrev = $parent.prev();
                var $parentNext = $parent.next();

                if (self.isHighlight($parent)) {

                    if (!haveSameColor($parent, $hl)) {

                        if (self.isHighlight($parentPrev) && haveSameColor($parentPrev, $hl) && !hl.previousSibling) {
                            $hl.insertAfter($parentPrev);
                            again = true;
                        }

                        if (self.isHighlight($parentNext) && haveSameColor($parentNext, $hl) && !hl.nextSibling) {
                            $hl.insertBefore($parentNext);
                            again = true;
                        }

                        if ($parent.is(':empty')) {
                            $parent.remove();
                        }

                    } else {
                        $parent.get(0).replaceChild(this.childNodes[0], hl);
                        $highlights[i] = $parent.get(0);
                        again = true;
                    }

                }

            });
        } while (again);
    };

    TextHighlighter.prototype.mergeSiblingHighlights = function (highlights) {
        var self = this;

        function shouldMerge(current, node) {
            return node && node.nodeType === NODE_TYPE.ELEMENT_NODE &&
                haveSameColor($(current), $(node)) &&
                $(node).hasClass(self.options.highlightedClass);
        }

        $.each(highlights, function() {
            var highlight = this;

            var prev = highlight.previousSibling;
            var next = highlight.nextSibling;

            if (shouldMerge(highlight, prev)) {
                $(highlight).prepend($(prev).contents());
                $(prev).remove();
            }
            if (shouldMerge(highlight, next)) {
                $(highlight).append($(next).contents());
                $(next).remove();
            }
        });

        $.each(highlights, function () {
            normalizeTextNodes(this);
        });
    };

    TextHighlighter.prototype.setColor = function (color) {
        this.options.color = color;
    };

    TextHighlighter.prototype.getColor = function () {
        return this.options.color;
    };

    TextHighlighter.prototype.removeHighlights = function (element) {
        var container = element || this.el,
            $highlights = this.getAllHighlights(container, true),
            self = this;

        function unwrapHighlight(highlight) {
            return $(highlight).contents().unwrap().filter(function () {
                return this.nodeType === NODE_TYPE.TEXT_NODE;
            });
        }

        function mergeSiblingTextNodes(textNode) {
            var prev = textNode.previousSibling;
            var next = textNode.nextSibling;

            if (prev && prev.nodeType === NODE_TYPE.TEXT_NODE) {
                textNode.nodeValue = prev.nodeValue + textNode.nodeValue;
                prev.parentNode.removeChild(prev);
            }
            if (next && next.nodeType === NODE_TYPE.TEXT_NODE) {
                textNode.nodeValue = textNode.nodeValue + next.nodeValue;
                next.parentNode.removeChild(next);
            }
        }

        function removeHighlight(highlight) {
            var textNodes = unwrapHighlight(highlight);
            $.each(textNodes, function () {
                mergeSiblingTextNodes(this);
            });
        }

        $highlights = $highlights.sort(function (a, b) {
            return $(b).parents().length - $(a).parents().length;
        });

        $highlights.each(function () {
            if (self.options.onRemoveHighlight(this) === true) {
                removeHighlight(this);
            }
        });
    };

    TextHighlighter.prototype.getAllHighlights = function (container, andSelf) {
        var $highlights = $(container).find('[' + DATA_ATTR + ']');

        if (andSelf === true && $(container).attr(DATA_ATTR)) {
            $highlights = $highlights.add(container);
        }
        return $highlights;
    };

    TextHighlighter.prototype.isHighlight = function ($el) {
        return !!$el.attr(DATA_ATTR);
    };

    TextHighlighter.prototype.serializeHighlights = function () {
        var $highlights = this.getAllHighlights(this.el, true),
            refEl = this.el,
            hlDescriptors = [];

        function getElementPath(el, refElement) {
            var path = [],
                elIndex;

            do {
                elIndex = $.inArray(el, el.parentNode.childNodes);
                path.unshift(elIndex);
                el = el.parentNode;
            } while (el !== refElement);

            return path;
        }

        $highlights = $highlights.sort(function (a, b) {
            return $(a).parents().length - $(b).parents().length;
        });

        $highlights.each(function (i, highlight) {
            var offset = 0, // Hl offset from previous sibling within parent node.
                length = highlight.textContent.length,
                hlPath = getElementPath(highlight, refEl),
                wrapper = $(highlight).clone().empty().get(0).outerHTML;

            if (highlight.previousSibling && highlight.previousSibling.nodeType === NODE_TYPE.TEXT_NODE) {
                offset = highlight.previousSibling.length;
            }

            hlDescriptors.push([
                wrapper,
                $(highlight).text(),
                hlPath.join(':'),
                offset,
                length
            ]);
        });

        return JSON.stringify(hlDescriptors);
    };

    TextHighlighter.prototype.deserializeHighlights = function (json) {
        var hlDescriptors,
            highlights = [],
            self = this;

        try {
            hlDescriptors = JSON.parse(json);
        } catch (e) {
            throw "Can't parse serialized highlights: " + e;
        }

        function deserializationFn(hlDescriptor) {
            var hl = {
                    wrapper: hlDescriptor[0],
                    text: hlDescriptor[1],
                    path: hlDescriptor[2].split(':'),
                    offset: hlDescriptor[3],
                    length: hlDescriptor[4]
                },
                elIndex = hl.path.pop(),
                node = self.el,
                textNode,
                hlNode,
                highlight,
                idx;

            while (!!(idx = hl.path.shift())) {
                node = node.childNodes[idx];
            }

            if (node.childNodes[elIndex-1] && node.childNodes[elIndex-1].nodeType === NODE_TYPE.TEXT_NODE) {
                elIndex -= 1;
            }

            textNode = node.childNodes[elIndex];
            hlNode = textNode.splitText(hl.offset);
            hlNode.splitText(hl.length);

            if (hlNode.nextSibling && !hlNode.nextSibling.nodeValue) {
                hlNode.parentNode.removeChild(hlNode.nextSibling);
            }

            if (hlNode.previousSibling && !hlNode.previousSibling.nodeValue) {
                hlNode.parentNode.removeChild(hlNode.previousSibling);
            }

            highlight = $(hlNode).wrap(hl.wrapper).parent().get(0);
            highlights.push(highlight);
        }

        $.each(hlDescriptors, function(i, hlDescriptor) {
            try {
                deserializationFn(hlDescriptor);
            } catch (e) {
                console.warn("Can't deserialize " + i + "-th descriptor. Cause: " + e);
                return true;
            }
        });

        return highlights;
    };

    /**
     * Returns TextHighlighter instance.
     */
    $.fn.getHighlighter = function() {
        return this.data(PLUGIN.name);
    };

    $.fn[PLUGIN.name] = function(options) {
        return this.each(function() {
            if (!$.data(this, PLUGIN.name)) {
                $.data(this, PLUGIN.name, new TextHighlighter(this, options));
            }
        });
    };

    $.textHighlighter = {
        /**
         * Returns HTML element to wrap selected text in.
         */
        createWrapper: function(options) {
            return $('<span></span>')
                .css('backgroundColor', options.color)
                .addClass(options.highlightedClass);
        },
        defaults: {
            color: '#ffff7b',
            highlightedClass: 'highlighted',
            contextClass: 'highlighter-context',
            onRemoveHighlight: function() { return true; },
            onBeforeHighlight: function() { return true; },
            onAfterHighlight: function() { }
        }
    };

})(jQuery);
