(function (global) {
    'use strict';

    var DATA_ATTR = 'data-highlighted',
        NODE_TYPE = {
            ELEMENT_NODE: 1,
            TEXT_NODE: 3
        },
        IGNORE_TAGS = [
            'SCRIPT', 'STYLE', 'SELECT', 'OPTION', 'BUTTON', 'OBJECT', 'APPLET', 'VIDEO', 'AUDIO', 'CANVAS', 'EMBED',
            'PARAM', 'METER', 'PROGRESS'
        ];

    function haveSameColor(a, b) {
        return dom(a).color() === dom(b).color();
    }

    function defaults(obj, source) {
        obj = obj || {};

        for (var prop in source) {
            if (source.hasOwnProperty(prop) && obj[prop] === void 0) {
                obj[prop] = source[prop];
            }
        }

        return obj;
    }

    function unique(arr) {
        return arr.filter(function (value, idx, self) {
            return self.indexOf(value) === idx;
        });
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

    var dom = function (el) {
        return {

            addClass: function (className) {
                if (el.classList) {
                    el.classList.add(className);
                } else {
                    el.className += ' ' + className;
                }
            },

            removeClass: function (className) {
                if (el.classList) {
                    el.classList.remove(className);
                } else {
                    el.className = el.className.replace(
                        new RegExp('(^|\\b)' + className + '(\\b|$)', 'gi'), ' '
                    );
                }
            },

            prepend: function (nodesToPrepend) {
                var nodes = Array.prototype.slice.call(nodesToPrepend),
                    i = nodes.length;

                while (i--) {
                    el.insertBefore(nodes[i], el.firstChild);
                }
            },

            append: function (nodesToAppend) {
                var nodes = Array.prototype.slice.call(nodesToAppend);

                for (var i = 0, len = nodes.length; i < len; ++i) {
                    el.appendChild(nodes[i]);
                }
            },

            insertAfter: function (refEl) {
                return refEl.parentNode.insertBefore(el, refEl.nextSibling);
            },

            insertBefore: function (refEl) {
                return refEl.parentNode.insertBefore(el, refEl);
            },

            remove: function () {
                el.parentNode.removeChild(el);
                el = null;
            },

            contains: function (child) {
                return el !== child && el.contains(child);
            },

            wrap: function (wrapper) {
                if (el.parentNode) {
                    el.parentNode.insertBefore(wrapper, el);
                }

                wrapper.appendChild(el);
                return wrapper;
            },

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

            parents: function () {
                var parent, path = [];

                while (!!(parent = el.parentNode)) {
                    path.push(parent);
                    el = parent;
                }

                return path;
            },

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

            color: function () {
                return el.style.backgroundColor;
            },

            fromHTML: function (html) {
                var div = document.createElement('div');
                div.innerHTML = html;
                return div.childNodes;
            }

        };
    };

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
        this.bindEvents();
    }

    TextHighlighter.prototype.destroy = function () {
        this.unbindEvents();
        dom(this.el).removeClass(this.options.contextClass);
    };

    TextHighlighter.prototype.bindEvents = function () {
        this.el.addEventListener('mouseup', this.highlightHandler.bind(this));
    };

    TextHighlighter.prototype.unbindEvents = function () {
        this.el.removeEventListener('mouseup', this.highlightHandler.bind(this));
    };

    TextHighlighter.prototype.highlightHandler = function () {
        this.doHighlight();
    };

    TextHighlighter.prototype.doHighlight = function () {
        var range = this.getCurrentRange(),
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

    TextHighlighter.prototype.flattenNestedHighlights = function (highlights) {
        var again,
            self = this;

        highlights.sort(function (a, b) {
            return dom(b).parents().length - dom(a).parents().length;
        });

        function flattenOnce() {
            var again = false;

            highlights.forEach(function (hl, i) {
                var parent = hl.parentElement;
                var parentPrev = parent.previousSibling;
                var parentNext = parent.nextSibling;

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
        });

        highlights.forEach(function (h) {
            dom(h).normalizeTextNodes();
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

        highlights.sort(function (a, b) {
            return dom(b).parents().length - dom(a).parents().length;
        });

        highlights.forEach(function (hl) {
            if (self.options.onRemoveHighlight(hl) === true) {
                removeHighlight(hl);
            }
        });
    };

    TextHighlighter.prototype.getAllHighlights = function (container, andSelf) {
        var nodeList = container.querySelectorAll('[' + DATA_ATTR + ']'),
            highlights = Array.prototype.slice.call(nodeList);

        if (andSelf === true && container.hasAttribute(DATA_ATTR)) {
            highlights.push(container);
        }

        return highlights;
    };

    TextHighlighter.prototype.isHighlight = function (el) {
        return el && el.nodeType === NODE_TYPE.ELEMENT_NODE && el.hasAttribute(DATA_ATTR);
    };

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
            } while (el !== refElement);

            return path;
        }

        highlights.sort(function (a, b) {
            return dom(a).parents().length - dom(b).parents().length;
        });

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
                dom(hlNode.nextSibling).remove();
                //hlNode.parentNode.removeChild(hlNode.nextSibling);
            }

            if (hlNode.previousSibling && !hlNode.previousSibling.nodeValue) {
                dom(hlNode.previousSibling).remove();
                //hlNode.parentNode.removeChild(hlNode.previousSibling);
            }

            //highlight = $(hlNode).wrap(hl.wrapper).parent().get(0);
            highlight = dom(hlNode).wrap(dom().fromHTML(hl.wrapper)[0]); // problem: wrapper is string
            highlights.push(highlight);
        }

        hlDescriptors.forEach(function (hlDescriptor, i) {
            try {
                deserializationFn(hlDescriptor);
            } catch (e) {
                if (console && console.warn) {
                    console.warn("Can't deserialize " + i + "-th descriptor. Cause: " + e);
                }
                return true;
            }
        });

        return highlights;
    };

    TextHighlighter.createWrapper = function(options) {
        var span = document.createElement('span');
        span.style.backgroundColor = options.color;
        span.className = options.highlightedClass;
        return span;
    };

    global.TextHighlighter = TextHighlighter;
})(window);