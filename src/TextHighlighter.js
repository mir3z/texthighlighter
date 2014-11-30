(function (global) {
    'use strict';

    var
        /**
         * Attribute added by default to every highlight.
         * @type {string}
         */
        DATA_ATTR = 'data-highlighted',

        NODE_TYPE = {
            ELEMENT_NODE: 1,
            TEXT_NODE: 3
        },

        /**
         * Don't highlight content of these tags.
         * @type {string[]}
         */
        IGNORE_TAGS = [
            'SCRIPT', 'STYLE', 'SELECT', 'OPTION', 'BUTTON', 'OBJECT', 'APPLET', 'VIDEO', 'AUDIO', 'CANVAS', 'EMBED',
            'PARAM', 'METER', 'PROGRESS'
        ];

    /**
     * Returns true if elements a i b have the same color.
     * @param {Node} a
     * @param {Node} b
     * @returns {boolean}
     */
    function haveSameColor(a, b) {
        return dom(a).color() === dom(b).color();
    }

    /**
     * Fills undefined values in obj with default properties with the same name from source object.
     * @param {object} obj - target object
     * @param {object} source - source object with default values
     * @returns {object}
     */
    function defaults(obj, source) {
        obj = obj || {};

        for (var prop in source) {
            if (source.hasOwnProperty(prop) && obj[prop] === void 0) {
                obj[prop] = source[prop];
            }
        }

        return obj;
    }

    /**
     * Returns array without duplicated values.
     * @param {Array} arr
     * @returns {Array}
     */
    function unique(arr) {
        return arr.filter(function (value, idx, self) {
            return self.indexOf(value) === idx;
        });
    }

    /**
     * Takes range object as parameter and refines it boundaries
     * @param range
     * @returns {object} refined boundaries and initial state of highlighting algorithm.
     */
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

    /**
     * Sorts array of DOM elements by its depth in DOM tree.
     * @param {HTMLElement[]} arr - array to sort.
     * @param {boolean} descending - order of sort.
     */
    function sortByDepth(arr, descending) {
        arr.sort(function (a, b) {
            return dom(descending ? b : a).parents().length - dom(descending ? a : b).parents().length;
        });
    }

    /**
     * Utility functions to make DOM manipulation easier.
     * @param {Node|HTMLElement} [el] - base DOM element to manipulate
     * @returns {object}
     */
    var dom = function (el) {

        return /** @lends dom **/ {

            /**
             * Adds class to element.
             * @param {string} className
             */
            addClass: function (className) {
                if (el.classList) {
                    el.classList.add(className);
                } else {
                    el.className += ' ' + className;
                }
            },

            /**
             * Removes class from element.
             * @param {string} className
             */
            removeClass: function (className) {
                if (el.classList) {
                    el.classList.remove(className);
                } else {
                    el.className = el.className.replace(
                        new RegExp('(^|\\b)' + className + '(\\b|$)', 'gi'), ' '
                    );
                }
            },

            /**
             * Prepends child nodes to base element.
             * @param {Node[]} nodesToPrepend
             */
            prepend: function (nodesToPrepend) {
                var nodes = Array.prototype.slice.call(nodesToPrepend),
                    i = nodes.length;

                while (i--) {
                    el.insertBefore(nodes[i], el.firstChild);
                }
            },

            /**
             * Appends child nodes to base element.
             * @param {Node[]} nodesToAppend
             */
            append: function (nodesToAppend) {
                var nodes = Array.prototype.slice.call(nodesToAppend);

                for (var i = 0, len = nodes.length; i < len; ++i) {
                    el.appendChild(nodes[i]);
                }
            },

            /**
             * Inserts base element after refEl.
             * @param {Node} refEl - node after which base element will be inserted
             * @returns {Node} - inserted element
             */
            insertAfter: function (refEl) {
                return refEl.parentNode.insertBefore(el, refEl.nextSibling);
            },

            /**
             * Inserts base element before refEl.
             * @param {Node} refEl - node before which base element will be inserted
             * @returns {Node} - inserted element
             */
            insertBefore: function (refEl) {
                return refEl.parentNode.insertBefore(el, refEl);
            },

            /**
             * Removes base element from DOM.
             */
            remove: function () {
                el.parentNode.removeChild(el);
                el = null;
            },

            /**
             * Returns true if base element contains given child.
             * @param {Node|HTMLElement} child
             * @returns {boolean}
             */
            contains: function (child) {
                return el !== child && el.contains(child);
            },

            /**
             * Wraps base element in wrapper element.
             * @param {HTMLElement} wrapper
             * @returns {HTMLElement} wrapper element
             */
            wrap: function (wrapper) {
                if (el.parentNode) {
                    el.parentNode.insertBefore(wrapper, el);
                }

                wrapper.appendChild(el);
                return wrapper;
            },

            /**
             * Unwraps base element.
             * @returns {Node[]} - child nodes of unwrapped element.
             */
            unwrap: function () {
                var nodes = Array.prototype.slice.call(el.childNodes),
                    wrapper;

                nodes.forEach(function (node) {
                    wrapper = node.parentNode;
                    dom(node).insertBefore(node.parentNode);
                    dom(wrapper).remove();
                });

                return nodes;
            },

            /**
             * Returns array of base element parents.
             * @returns {HTMLElement[]}
             */
            parents: function () {
                var parent, path = [];

                while (!!(parent = el.parentNode)) {
                    path.push(parent);
                    el = parent;
                }

                return path;
            },

            /**
             * Normalizes text nodes within base element, ie. merges sibling text nodes and assures that every
             * element node has only one text node.
             * It should does the same as standard element.normalize, but IE implements it incorrectly.
             */
            normalizeTextNodes: function () {
                if (!el) {
                    return;
                }

                if (el.nodeType === NODE_TYPE.TEXT_NODE) {
                    while (el.nextSibling && el.nextSibling.nodeType === NODE_TYPE.TEXT_NODE) {
                        el.nodeValue += el.nextSibling.nodeValue;
                        el.parentNode.removeChild(el.nextSibling);
                    }
                } else {
                    dom(el.firstChild).normalizeTextNodes();
                }
                dom(el.nextSibling).normalizeTextNodes();
            },

            /**
             * Returns element background color.
             * @returns {CSSStyleDeclaration.backgroundColor}
             */
            color: function () {
                return el.style.backgroundColor;
            },

            /**
             * Creates dom element from given html string.
             * @param {string} html
             * @returns {NodeList}
             */
            fromHTML: function (html) {
                var div = document.createElement('div');
                div.innerHTML = html;
                return div.childNodes;
            },

            /**
             * Returns first range of the window of base element.
             * @returns {Range}
             */
            getRange: function () {
                var selection = dom(el).getSelection(),
                    range;

                if (selection.rangeCount > 0) {
                    range = selection.getRangeAt(0);
                }

                return range;
            },

            /**
             * Removes all ranges of the window of base element.
             */
            removeAllRanges: function () {
                var selection = dom(el).getSelection();
                selection.removeAllRanges();
            },

            /**
             * Returns selection object of the window of base element.
             * @returns {Selection}
             */
            getSelection: function () {
                return dom(el).getWindow().getSelection();
            },

            /**
             * Returns window of the base element.
             * @returns {Window}
             */
            getWindow: function () {
                return dom(el).getDocument().defaultView;
            },

            /**
             * Returns document of the base element.
             * @returns {HTMLDocument}
             */
            getDocument: function () {
                // if ownerDocument is null then el is the document itself.
                return el.ownerDocument || el;
            }

        };
    };

    function bindEvents(el, scope) {
        el.addEventListener('mouseup', scope.highlightHandler.bind(scope));
    }

    function unbindEvents(el, scope) {
        el.removeEventListener('mouseup', scope.highlightHandler.bind(scope));
    }

    /**
     * Creates TextHighlighter instance and binds to given DOM elements.
     * @param {HTMLElement} element - DOM element to which highlighted will be applied.
     * @param {object} options - additional options.
     * @param {string} options.color - highlight color.
     * @param {string} options.highlightedClass - class added to highlight, 'highlighted' by default.
     * @param {string} options.contextClass - class added to element to which highlighter is applied,
     *  'highlighter-context' by default.
     * @param {function} options.onRemoveHighlight - function called before highlight is removed. Highlight is
     *  passed as param. Function should return true if highlight should be removed, or false - to prevent removal.
     * @param {function} options.onBeforeHighlight - function called before highlight is created. Range object is
     *  passed as param. Function should return true to continue processing, or false - to prevent highlighting.
     * @param {function} options.onAfterHighlight - function called after highlight is created. Highlight is passed
     *  as param.
     * @class TextHighlighter
     */
    function TextHighlighter(element, options) {
        this.el = element;
        this.options = defaults(options, {
            color: '#ffff7b',
            highlightedClass: 'highlighted',
            contextClass: 'highlighter-context',
            onRemoveHighlight: function () { return true; },
            onBeforeHighlight: function () { return true; },
            onAfterHighlight: function () { }
        });

        dom(this.el).addClass(this.options.contextClass);
        bindEvents(this.el, this);
    }

    /**
     * Permanently disables highlighting.
     * Unbinds events and remove context element class.
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.destroy = function () {
        unbindEvents(this.el, this);
        dom(this.el).removeClass(this.options.contextClass);
    };

    TextHighlighter.prototype.highlightHandler = function () {
        this.doHighlight();
    };

    /**
     * Highlights current range.
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.doHighlight = function () {
        var range = dom(this.el).getRange(),
            wrapper,
            createdHighlights,
            normalizedHighlights;

        if (!range || range.collapsed) {
            return;
        }

        if (this.options.onBeforeHighlight(range) === true) {
            wrapper = TextHighlighter.createWrapper(this.options);

            createdHighlights = this.highlightRange(range, wrapper);
            normalizedHighlights = this.normalizeHighlights(createdHighlights);

            this.options.onAfterHighlight(range, normalizedHighlights);
        }

        dom(this.el).removeAllRanges();
    };

    /**
     * Highlights range.
     * Wraps text of given range object in wrapper element.
     * @param {Range} range
     * @param {HTMLElement} wrapper
     * @returns {Array} - array of created highlights.
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.highlightRange = function (range, wrapper) {
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
            wrapperClone,
            nodeParent;


        do {
            if (goDeeper && node.nodeType === NODE_TYPE.TEXT_NODE) {

                if (IGNORE_TAGS.indexOf(node.parentNode.tagName) === -1 && node.nodeValue.trim() !== '') {
                    wrapperClone = wrapper.cloneNode(true);
                    wrapperClone.setAttribute(DATA_ATTR, true);
                    nodeParent = node.parentNode;

                    // highlight if node is inside the el
                    if (dom(this.el).contains(nodeParent) || nodeParent === this.el) {
                        //highlight = $(node).wrap(wrapperClone).parent().get(0);
                        highlight = dom(node).wrap(wrapperClone);
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

    /**
     * Normalizes highlights. Ensures that highlighting is done with use of the smallest possible number of
     * wrapping HTML elements.
     * Flattens highlights structure and merges sibling highlights. Normalizes text nodes within highlights.
     * @param {Array} highlights - highlights to normalize.
     * @returns {Array} - array of normalized highlights. Order and number of returned highlights may be different than
     * input highlights.
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.normalizeHighlights = function (highlights) {
        var normalizedHighlights;

        this.flattenNestedHighlights(highlights);
        this.mergeSiblingHighlights(highlights);

        // omit removed nodes
        normalizedHighlights = highlights.filter(function (hl) {
            return hl.parentElement ? hl : null;
        });

        normalizedHighlights = unique(normalizedHighlights);

        return normalizedHighlights;
    };

    /**
     * Flattens highlights structure.
     * Note: this method changes input highlights - they order and number after calling this method may change.
     * @param {Array} highlights - highlights to flatten.
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.flattenNestedHighlights = function (highlights) {
        var again,
            self = this;

        sortByDepth(highlights, true);

        function flattenOnce() {
            var again = false;

            highlights.forEach(function (hl, i) {
                var parent = hl.parentElement,
                    parentPrev = parent.previousSibling,
                    parentNext = parent.nextSibling;

                if (self.isHighlight(parent)) {

                    if (!haveSameColor(parent, hl)) {

                        if (self.isHighlight(parentPrev) && haveSameColor(parentPrev, hl) && !hl.previousSibling) {
                            dom(hl).insertAfter(parentPrev);
                            again = true;
                        }

                        if (self.isHighlight(parentNext) && haveSameColor(parentNext, hl) && !hl.nextSibling) {
                            dom(hl).insertBefore(parentNext);
                            again = true;
                        }

                        if (!parent.hasChildNodes()) {
                            dom(parent).remove();
                        }

                    } else {
                        parent.replaceChild(hl.firstChild, hl);
                        highlights[i] = parent;
                        again = true;
                    }

                }

            });

            return again;
        }

        do {
            again = flattenOnce();
        } while (again);
    };

    /**
     * Merges sibling highlights and normalizes descendant text nodes.
     * Note: this method changes input highlights - they order and number after calling this method may change.
     * @param highlights
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.mergeSiblingHighlights = function (highlights) {
        var self = this;

        function shouldMerge(current, node) {
            return node && node.nodeType === NODE_TYPE.ELEMENT_NODE &&
                haveSameColor(current, node) &&
                self.isHighlight(node);
        }

        highlights.forEach(function (highlight) {
            var prev = highlight.previousSibling,
                next = highlight.nextSibling;

            if (shouldMerge(highlight, prev)) {
                dom(highlight).prepend(prev.childNodes);
                dom(prev).remove();
            }
            if (shouldMerge(highlight, next)) {
                dom(highlight).append(next.childNodes);
                dom(next).remove();
            }

            dom(highlight).normalizeTextNodes();
        });
    };

    /**
     * Sets highlighting color.
     * @param {string} color - valid CSS color.
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.setColor = function (color) {
        this.options.color = color;
    };

    /**
     * Returns highlighting color.
     * @returns {string}
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.getColor = function () {
        return this.options.color;
    };

    /**
     * Removes highlights from element. If element is a highlight itself, it is removed as well.
     * If no element is given, all highlights all removed.
     * @param {HTMLElement} [element] - element to remove highlights from
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.removeHighlights = function (element) {
        var container = element || this.el,
            highlights = this.getAllHighlights(container, true),
            self = this;

        function mergeSiblingTextNodes(textNode) {
            var prev = textNode.previousSibling,
                next = textNode.nextSibling;

            if (prev && prev.nodeType === NODE_TYPE.TEXT_NODE) {
                textNode.nodeValue = prev.nodeValue + textNode.nodeValue;
                dom(prev).remove();
            }
            if (next && next.nodeType === NODE_TYPE.TEXT_NODE) {
                textNode.nodeValue = textNode.nodeValue + next.nodeValue;
                dom(next).remove();
            }
        }

        function removeHighlight(highlight) {
            var textNodes = dom(highlight).unwrap();

            textNodes.forEach(function (node) {
                mergeSiblingTextNodes(node);
            });
        }

        sortByDepth(highlights, true);

        highlights.forEach(function (hl) {
            if (self.options.onRemoveHighlight(hl) === true) {
                removeHighlight(hl);
            }
        });
    };

    /**
     * Returns highlights from given container.
     * @param container - return highlights from this element.
     * @param andSelf - if set to true and container is a highlight itself, include container to returned results.
     * @returns {Array} - array of highlights.
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.getAllHighlights = function (container, andSelf) {
        var nodeList = container.querySelectorAll('[' + DATA_ATTR + ']'),
            highlights = Array.prototype.slice.call(nodeList);

        if (andSelf === true && container.hasAttribute(DATA_ATTR)) {
            highlights.push(container);
        }

        return highlights;
    };

    /**
     * Returns true if element is a highlight.
     * All highlights have 'data-highlighted' attribute.
     * @param el - element to check.
     * @returns {boolean}
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.isHighlight = function (el) {
        return el && el.nodeType === NODE_TYPE.ELEMENT_NODE && el.hasAttribute(DATA_ATTR);
    };

    /**
     * Serializes all highlights in the element the highlighter is applied to.
     * @returns {string} - stringified JSON with highlights definition
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.serializeHighlights = function () {
        var highlights = this.getAllHighlights(this.el, true),
            refEl = this.el,
            hlDescriptors = [];

        function getElementPath(el, refElement) {
            var path = [],
                childNodes;

            do {
                childNodes = Array.prototype.slice.call(el.parentNode.childNodes);
                path.unshift(childNodes.indexOf(el));
                el = el.parentNode;
            } while (el !== refElement || !el);

            return path;
        }

        sortByDepth(highlights, false);

        highlights.forEach(function (highlight) {
            var offset = 0, // Hl offset from previous sibling within parent node.
                length = highlight.textContent.length,
                hlPath = getElementPath(highlight, refEl),
                wrapper = highlight.cloneNode(true);

            wrapper.innerHTML = '';
            wrapper = wrapper.outerHTML;

            if (highlight.previousSibling && highlight.previousSibling.nodeType === NODE_TYPE.TEXT_NODE) {
                offset = highlight.previousSibling.length;
            }

            hlDescriptors.push([
                wrapper,
                highlight.textContent,
                hlPath.join(':'),
                offset,
                length
            ]);
        });

        return JSON.stringify(hlDescriptors);
    };

    /**
     * Deserializes highlights.
     * @throws exception when can't parse JSON or JSON has invalid structure.
     * @param {object} json - JSON object with highlights definition.
     * @returns {Array} - array of deserialized highlights.
     * @memberof TextHighlighter
     */
    TextHighlighter.prototype.deserializeHighlights = function (json) {
        var hlDescriptors,
            highlights = [],
            self = this;

        try {
            hlDescriptors = JSON.parse(json);
        } catch (e) {
            throw "Can't parse JSON: " + e;
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
                hlNode,
                highlight,
                idx;

            while (!!(idx = hl.path.shift())) {
                node = node.childNodes[idx];
            }

            if (node.childNodes[elIndex-1] && node.childNodes[elIndex-1].nodeType === NODE_TYPE.TEXT_NODE) {
                elIndex -= 1;
            }

            node = node.childNodes[elIndex];
            hlNode = node.splitText(hl.offset);
            hlNode.splitText(hl.length);

            if (hlNode.nextSibling && !hlNode.nextSibling.nodeValue) {
                dom(hlNode.nextSibling).remove();
            }

            if (hlNode.previousSibling && !hlNode.previousSibling.nodeValue) {
                dom(hlNode.previousSibling).remove();
            }

            highlight = dom(hlNode).wrap(dom().fromHTML(hl.wrapper)[0]);
            highlights.push(highlight);
        }

        hlDescriptors.forEach(function (hlDescriptor) {
            try {
                deserializationFn(hlDescriptor);
            } catch (e) {
                if (console && console.warn) {
                    console.warn("Can't deserialize highlight descriptor. Cause: " + e);
                }
            }
        });

        return highlights;
    };

    /**
     * Creates wrapper for highlights.
     * TextHighlighter instance calls this method each time it needs to create highlights and pass options retrieved
     * in constructor.
     * @param {object} options - the same object as in TextHighlighter constructor.
     * @returns {HTMLElement}
     * @memberof TextHighlighter
     * @static
     */
    TextHighlighter.createWrapper = function (options) {
        var span = document.createElement('span');
        span.style.backgroundColor = options.color;
        span.className = options.highlightedClass;
        return span;
    };

    global.TextHighlighter = TextHighlighter;
})(window);