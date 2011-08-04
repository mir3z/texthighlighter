$(document).ready(function() {
    var sandbox = $('#sandbox');

    function setup() {
        sandbox.textHighlighter();
    }

    function teardown() {
        sandbox.textHighlighter('destroy');
        sandbox.empty();
    }

    // =========================================================================

    test('Initialization', function() {
        ok(jQuery(), 'jQuery is loaded');
        ok(jQuery().textHighlighter, 'Plugin is loaded');

        sandbox.textHighlighter();

        ok($.fn.textHighlighter.defaults, '$.fn.textHighlighter.defaults present');
        ok($.fn.textHighlighter.createWrapper, '$.fn.textHighlighter.createWrapper present');

        equal(sandbox.attr('class'), $.fn.textHighlighter.defaults.contextClass,
              'Context has valid class');

        var attachedEvents = $.data(sandbox.get(0), 'events');
        ok(attachedEvents['mouseup'], 'Event handler for onmouseup is attached');

        sandbox.textHighlighter('destroy');
    });

    test('Destroying', function() {
        sandbox.textHighlighter();
        sandbox.textHighlighter('destroy');

        var attachedEvents = $.data(sandbox.get(0), 'events');
        ok(attachedEvents === undefined, 'Event handlers are detached');

        var defaultContextClass = $.fn.textHighlighter.defaults.contextClass
        ok(sandbox.hasClass(defaultContextClass) == false, "Context has't got '" +
           defaultContextClass + "' class");
    });

    test('Non-existing method call', function() {
        sandbox.textHighlighter();
        raises(function() {
            sandbox.textHighlighter('foo');
        }, 'Method does not exist');
    });

    test('Creating wrapper', function() {
        var wrapper = $.fn.textHighlighter.createWrapper($.fn.textHighlighter.defaults);
        var wrapperColor = wrapper.css('background-color')
            || wrapper.get(0).style.backgroundColor;

        ok(wrapper.html() == '', 'Wrapper is empty');
        equal(wrapper.get(0).tagName, 'SPAN', 'Wrapper has valid tag name');
        equal(wrapper.attr('class'), $.fn.textHighlighter.defaults.highlightedClass,
              'Wrapper has valid class');
        equal(rgb2hex(wrapperColor), $.fn.textHighlighter.defaults.color,
              'Wrapper has valid color');

        teardown();
    });

    // =========================================================================

    module('Highlighting plain range', {
        setup: setup,
        teardown: teardown
    });

    test('Simple range in the middle of the container', function() {
        var nodeTxt = 'Lorem ipsum dolor sit amet.';
        var rangeTxt = 'ipsum';
        var nodeWithRange = createTextNodeWithRange(nodeTxt, rangeTxt);

        assertTextNodeWithRange(nodeWithRange.node, nodeWithRange.range, nodeTxt, rangeTxt);

        sandbox.trigger('mouseup');

        assertHighlightsCount(1);
        assertHighlightedText(0, rangeTxt);
    });

    test('Simple range at the beginning of the container', function() {
        var nodeTxt = 'Lorem ipsum dolor sit amet.';
        var rangeTxt = 'Lorem';
        var nodeWithRange = createTextNodeWithRange(nodeTxt, rangeTxt);

        assertTextNodeWithRange(nodeWithRange.node, nodeWithRange.range, nodeTxt, rangeTxt);

        sandbox.trigger('mouseup');

        assertHighlightsCount(1);
        assertHighlightedText(0, rangeTxt);
    });

    test('Simple range at the end of the container', function() {
        var nodeTxt = 'Lorem ipsum dolor sit amet.';
        var rangeTxt = 'amet.';
        var nodeWithRange = createTextNodeWithRange(nodeTxt, rangeTxt);

        assertTextNodeWithRange(nodeWithRange.node, nodeWithRange.range, nodeTxt, rangeTxt);

        sandbox.trigger('mouseup');

        assertHighlightsCount(1);
        assertHighlightedText(0, rangeTxt);
    });

    test('Maximal range within the container', function() {
        var nodeTxt = 'Lorem ipsum dolor sit amet.';
        var rangeTxt = nodeTxt;
        var nodeWithRange = createTextNodeWithRange(nodeTxt, rangeTxt);

        assertTextNodeWithRange(nodeWithRange.node, nodeWithRange.range, nodeTxt, rangeTxt);

        sandbox.trigger('mouseup');

        assertHighlightsCount(1);
        assertHighlightedText(0, rangeTxt);
    });

    test('Only whitespace range', function() {
        var nodeTxt = 'Lorem ipsum.';
        var rangeTxt = ' ';
        var nodeWithRange = createTextNodeWithRange(nodeTxt, rangeTxt);

        assertTextNodeWithRange(nodeWithRange.node, nodeWithRange.range, nodeTxt, rangeTxt);

        sandbox.trigger('mouseup');

        assertHighlightsCount(0);
    });

    // =========================================================================

    module('Highlighting in nested structures', {
        setup: setup,
        teardown: teardown
    });

    // Lorem |ipsum <b>dolor| sit</b> amet.
    test('Lorem |ipsum &lt;b&gt;dolor| sit&lt;/b&gt; amet.', function() {
        var sandboxInitHtml = 'Lorem ipsum <b>dolor sit</b> amet.';
        var sandboxExpectedText = 'Lorem ipsum dolor sit amet.';

        sandbox.html(sandboxInitHtml);
        var range = createRange(sandbox.textNodes().get(0), sandbox.textNodes().get(1), 6, 5);
        equal(range.toString(), 'ipsum dolor', 'Range text is valid');

        sandbox.trigger('mouseup');

        assertHighlightsCount(2);
        assertHighlightedText(0, 'ipsum ');
        assertHighlightedText(1, 'dolor');
        ok(sandbox.text() == sandboxExpectedText, 'Sandbox text is valid');
    });

    // Lorem ipsum <b>dolor |sit</b> amet.|
    test('Lorem ipsum &lt;b&gt;dolor |sit&lt;/b&gt; amet.|', function() {
        var sandboxInitHtml = 'Lorem ipsum <b>dolor sit</b> amet.';
        var sandboxExpectedText = 'Lorem ipsum dolor sit amet.';

        sandbox.html(sandboxInitHtml);
        var range = createRange(sandbox.textNodes().get(1), sandbox.textNodes().get(2), 6, 6);
        equal(range.toString(), 'sit amet.', 'Range text is valid');

        sandbox.trigger('mouseup');

        assertHighlightsCount(2);
        assertHighlightedText(0, 'sit');
        assertHighlightedText(1, ' amet.');
        ok(sandbox.text() == sandboxExpectedText, 'Sandbox text is valid');
    });

    // Lorem ipsum |<b>dolor sit</b>| amet.
    test('Lorem ipsum |&lt;b&gt;dolor sit&lt;/b&gt;| amet.', function() {
        var sandboxInitHtml = 'Lorem ipsum <b>dolor sit</b> amet.';
        var sandboxExpectedText = 'Lorem ipsum dolor sit amet.';

        sandbox.html(sandboxInitHtml);
        var range = createRange(sandbox.textNodes().get(0), sandbox.textNodes().get(2), 12, 0);
        equal(range.toString(), 'dolor sit', 'Range text is valid');

        sandbox.trigger('mouseup');

        assertHighlightsCount(1);
        assertHighlightedText(0, 'dolor sit');
        ok(sandbox.text() == sandboxExpectedText, 'Sandbox text is valid');
    });

    // |Lorem ipsum <b>dolor sit</b> amet.|
    test('|Lorem ipsum &lt;b&gt;dolor sit&lt;/b&gt; amet.|', function() {
        var sandboxInitHtml = 'Lorem ipsum <b>dolor sit</b> amet.';
        var sandboxExpectedText = 'Lorem ipsum dolor sit amet.';

        sandbox.html(sandboxInitHtml);
        var range = createRange(sandbox.textNodes().get(0), sandbox.textNodes().get(2), 0, 6);
        equal(range.toString(), 'Lorem ipsum dolor sit amet.', 'Range text is valid');

        sandbox.trigger('mouseup');

        assertHighlightsCount(3);
        assertHighlightedText(0, 'Lorem ipsum ');
        assertHighlightedText(1, 'dolor sit');
        assertHighlightedText(2, ' amet.');
        ok(sandbox.text() == sandboxExpectedText, 'Sandbox text is valid');
    });

    // Lorem <b>ip|sum</b> dolor <b>si|t</b> amet.
    test('Lorem &lt;b&gt;ip|sum&lt;/b&gt; dolor &lt;b&gt;si|t&lt;/b&gt; amet.', function() {
        var sandboxInitHtml = 'Lorem <b>ipsum</b> dolor <b>sit</b> amet.';
        var sandboxExpectedText = 'Lorem ipsum dolor sit amet.';

        sandbox.html(sandboxInitHtml);
        var range = createRange(sandbox.textNodes().get(1), sandbox.textNodes().get(3), 2, 2);
        equal(range.toString(), 'sum dolor si', 'Range text is valid');

        sandbox.trigger('mouseup');

        assertHighlightsCount(3);
        assertHighlightedText(0, 'sum');
        assertHighlightedText(1, ' dolor ');
        assertHighlightedText(2, 'si');
        ok(sandbox.text() == sandboxExpectedText, 'Sandbox text is valid');
    });

    // Lorem <b>ipsum|</b> dolor <b>|sit</b> amet.
    test('Lorem &lt;b&gt;ipsum|&lt;/b&gt dolor &lt;b&gt;|sit&lt;/b&gt amet.', function() {
        var sandboxInitHtml = 'Lorem <b>ipsum</b> dolor <b>sit</b> amet.';
        var sandboxExpectedText = 'Lorem ipsum dolor sit amet.';

        sandbox.html(sandboxInitHtml);
        var range = createRange(sandbox.textNodes().get(1), sandbox.textNodes().get(3), 5, 0);
        equal(range.toString(), ' dolor ', 'Range text is valid');

        sandbox.trigger('mouseup');

        assertHighlightsCount(1);
        assertHighlightedText(0, ' dolor ');
        ok(sandbox.text() == sandboxExpectedText, 'Sandbox text is valid');
    });

    // |Lorem <b>ipsum</b> dolor <b>sit</b> amet.|
    test('|Lorem &lt;b&gt;ipsum&lt;/b&gt; dolor &lt;b&gt;sit&lt;/b&gt; amet.|', function() {
        var sandboxInitHtml = 'Lorem <b>ipsum</b> dolor <b>sit</b> amet.';
        var sandboxExpectedText = 'Lorem ipsum dolor sit amet.';

        sandbox.html(sandboxInitHtml);
        var range = createRange(sandbox.textNodes().get(0), sandbox.textNodes().get(4), 0, 6);
        equal(range.toString(), 'Lorem ipsum dolor sit amet.', 'Range text is valid');

        sandbox.trigger('mouseup');

        assertHighlightsCount(5);
        assertHighlightedText(0, 'Lorem ');
        assertHighlightedText(1, 'ipsum');
        assertHighlightedText(2, ' dolor ');
        assertHighlightedText(3, 'sit');
        assertHighlightedText(4, ' amet.');
        ok(sandbox.text() == sandboxExpectedText, 'Sandbox text is valid');
    });

    // |Lorem <b>ipsum <i>dolor|</i> sit</b> amet.
    test('|Lorem &lt;b&gt;ipsum &lt;i&gt;dolor|&lt;/i&gt; sit&lt;/b&gt; amet.', function() {
        var sandboxInitHtml = 'Lorem <b>ipsum <i>dolor</i> sit</b> amet.';
        var sandboxExpectedText = 'Lorem ipsum dolor sit amet.';

        sandbox.html(sandboxInitHtml);
        var range = createRange(sandbox.textNodes().get(0), sandbox.textNodes().get(2), 0, 5);
        equal(range.toString(), 'Lorem ipsum dolor', 'Range text is valid');

        sandbox.trigger('mouseup');

        assertHighlightsCount(3);
        assertHighlightedText(0, 'Lorem ');
        assertHighlightedText(1, 'ipsum ');
        assertHighlightedText(2, 'dolor');
        ok(sandbox.text() == sandboxExpectedText, 'Sandbox text is valid');
    });

    // Lorem <b>ipsum <i>|dolor</i> sit</b> amet.|
    test('Lorem &lt;b&gt;ipsum &lt;i&gt;|dolor&lt;/i&gt; sit&lt;/b&gt; amet.|', function() {
        var sandboxInitHtml = 'Lorem <b>ipsum <i>dolor</i> sit</b> amet.';
        var sandboxExpectedText = 'Lorem ipsum dolor sit amet.';

        sandbox.html(sandboxInitHtml);
        var range = createRange(sandbox.textNodes().get(2), sandbox.textNodes().get(4), 0, 6);
        equal(range.toString(), 'dolor sit amet.', 'Range text is valid');

        sandbox.trigger('mouseup');

        assertHighlightsCount(3);
        assertHighlightedText(0, 'dolor');
        assertHighlightedText(1, ' sit');
        assertHighlightedText(2, ' amet.');
        ok(sandbox.text() == sandboxExpectedText, 'Sandbox text is valid');
    });

    // =========================================================================

    module('Special cases', {
        setup: setup,
        teardown: teardown
    });

    test('Range contains select tag', function() {
        var sandboxInitHtml = 'Lorem <select><option>ipsum</option></select> dolor.';
        var sandboxExpectedText = 'Lorem ipsum dolor.';

        sandbox.html(sandboxInitHtml);
        var range = createRange(sandbox.textNodes().get(0), sandbox.textNodes().get(2), 0, 7);
        equal(range.toString(), sandboxExpectedText, 'Range text is valid');

        sandbox.trigger('mouseup');

        assertHighlightsCount(2);
        assertHighlightedText(0, 'Lorem ');
        assertHighlightedText(1, ' dolor.');
        ok(sandbox.text() == sandboxExpectedText, 'Sandbox text is valid');
    });

    test('End container is not text node', function() {
        var sandboxInitHtml = '<p>Lorem <span>ipsum</span> dolor.';
        var sandboxExpectedText = 'Lorem ipsum dolor.';

        sandbox.html(sandboxInitHtml);
        var range = createRange(
            sandbox.textNodes().get(0),
            sandbox.children('p').get(0).childNodes.item(1),
            0, 1
        );
        equal(range.toString(), 'Lorem ipsum', 'Range text is valid');

        sandbox.trigger('mouseup');

        assertHighlightsCount(2);
        assertHighlightedText(0, 'Lorem ');
        assertHighlightedText(1, 'ipsum');
        ok(sandbox.text() == sandboxExpectedText, 'Sandbox text is valid');
    });

    test('Start container is not text node', function() {
        var sandboxInitHtml = '<p>Lorem <span>ipsum</span> dolor.';
        var sandboxExpectedText = 'Lorem ipsum dolor.';

        sandbox.html(sandboxInitHtml);
        var range = createRange(
            sandbox.children('p').get(0).childNodes.item(1),
            sandbox.textNodes().get(2),
            0, 7
        );
        equal(range.toString(), 'ipsum dolor.', 'Range text is valid');

        sandbox.trigger('mouseup');

        assertHighlightsCount(2);
        assertHighlightedText(0, 'ipsum');
        assertHighlightedText(1, ' dolor.');
        ok(sandbox.text() == sandboxExpectedText, 'Sandbox text is valid');
    });

    // =========================================================================

    module('Normalization', {
        setup: setup,
        teardown: teardown
    });

    /**
     * [..] - denotes first highlight
     * {..} - second highlight
     * (..) - third highlight
     */

    // <p>Lorem [ipsum {dolor} sit] amet.</p>
    test('&lt;p&gt;Lorem [ipsum {dolor} sit] amet.&lt;/p&gt;', function() {
        var sandboxInitHtml = '<p>Lorem ipsum dolor sit amet.</p>';
        var sandboxExpectedText = 'Lorem ipsum dolor sit amet.';
        sandbox.html(sandboxInitHtml);

        var outerRange = createRange(sandbox.textNodes().get(0), sandbox.textNodes().get(0), 6, 21);
        var outerRangeExpectedText = 'ipsum dolor sit';
        equal(outerRange.toString(), outerRangeExpectedText, 'Outer range text is valid');
        sandbox.trigger('mouseup');
        assertHighlightsCount(1);
        assertHighlightedText(0, outerRangeExpectedText);

        var innerRange = createRange(sandbox.textNodes().get(1), sandbox.textNodes().get(1), 6, 11);
        var innerRangeExpectedText = 'dolor';
        equal(innerRange.toString(), innerRangeExpectedText, 'Inner range text is valid');
        sandbox.trigger('mouseup');
        assertHighlightsCount(1);
        assertHighlightedText(0, outerRangeExpectedText);

        equal(sandbox.text(), sandboxExpectedText, 'Sandbox text is valid');
    });

    // <p>Lorem {ipsum [dolor] sit} amet.</p>
    test('&lt;p&gt;Lorem {ipsum [dolor] sit} amet.&lt;/p&gt;', function() {
        var sandboxInitHtml = '<p>Lorem ipsum dolor sit amet.</p>';
        var sandboxExpectedText = 'Lorem ipsum dolor sit amet.';
        sandbox.html(sandboxInitHtml);

        var innerRange = createRange(sandbox.textNodes().get(0), sandbox.textNodes().get(0), 12, 17);
        var innerRangeExpectedText = 'dolor';
        equal(innerRange.toString(), innerRangeExpectedText, 'Inner range text is valid');
        sandbox.trigger('mouseup');
        assertHighlightsCount(1);
        assertHighlightedText(0, innerRangeExpectedText);

        var outerRange = createRange(sandbox.textNodes().get(0), sandbox.textNodes().get(2), 6, 4);
        var outerRangeExpectedText = 'ipsum dolor sit';
        equal(outerRange.toString(), outerRangeExpectedText, 'outer range text is valid');
        sandbox.trigger('mouseup');
        assertHighlightsCount(1);
        assertHighlightedText(0, outerRangeExpectedText);

        equal(sandbox.text(), sandboxExpectedText, 'Sandbox text is valid');
    });

    // <p>Lorem {ipsum [dolor} sit amet.]</p>
    test('&lt;p&gt;Lorem {ipsum [dolor} sit amet.]&lt;/p&gt;', function() {
        var sandboxInitHtml = '<p>Lorem ipsum dolor sit amet.</p>';
        var sandboxExpectedText = 'Lorem ipsum dolor sit amet.';
        sandbox.html(sandboxInitHtml);

        var range1 = createRange(sandbox.textNodes().get(0), sandbox.textNodes().get(0), 12, 27);
        var range1ExpectedText = 'dolor sit amet.';
        equal(range1.toString(), range1ExpectedText, 'Range 1 text is valid');
        sandbox.trigger('mouseup');
        assertHighlightsCount(1);
        assertHighlightedText(0, range1ExpectedText);

        var range2 = createRange(sandbox.textNodes().get(0), sandbox.textNodes().get(1), 6, 5);
        var range2ExpectedText = 'ipsum dolor';
        equal(range2.toString(), range2ExpectedText, 'Range 2 text is valid');
        sandbox.trigger('mouseup');
        assertHighlightsCount(1);
        assertHighlightedText(0, 'ipsum dolor sit amet.');

        equal(sandbox.text(), sandboxExpectedText, 'Sandbox text is valid');
    });

    // [Lorem ip]{sum dolor} sit amet.
    test('&lt;p&gt;[Lorem ip]{sum dolor} sit amet.&lt;/p&gt;', function() {
        var sandboxInitHtml = '<p>Lorem ipsum dolor sit amet.</p>';
        var sandboxExpectedText = 'Lorem ipsum dolor sit amet.';
        sandbox.html(sandboxInitHtml);

        var leftRange = createRange(sandbox.textNodes().get(0), sandbox.textNodes().get(0), 0, 8);
        var leftRangeExpectedText = 'Lorem ip';
        equal(leftRange.toString(), leftRangeExpectedText, 'Left range text is valid');
        sandbox.trigger('mouseup');
        assertHighlightsCount(1);
        assertHighlightedText(0, leftRangeExpectedText);

        var rightRange = createRange(sandbox.textNodes().get(1), sandbox.textNodes().get(1), 0, 9);
        var rightRangeExpectedText = 'sum dolor';
        equal(rightRange.toString(), rightRangeExpectedText, 'Right range text is valid');
        sandbox.trigger('mouseup');
        assertHighlightsCount(1);
        assertHighlightedText(0, leftRangeExpectedText + rightRangeExpectedText);

        equal(sandbox.text(), sandboxExpectedText, 'Sandbox text is valid');
    });

    // <p>[Lorem (ipsum] dolor {sit) amet.}</p>
    test('&lt;p&gt;[Lorem (ipsum] dolor {sit) amet.}&lt;/p&gt;', function() {
        var sandboxInitHtml = '<p>Lorem ipsum dolor sit amet.</p>';
        var sandboxExpectedText = 'Lorem ipsum dolor sit amet.';
        sandbox.html(sandboxInitHtml);

        var range1 = createRange(sandbox.textNodes().get(0), sandbox.textNodes().get(0), 0, 11);
        var range1ExpectedText = 'Lorem ipsum';
        equal(range1.toString(), range1ExpectedText, 'Range 1 text is valid');
        sandbox.trigger('mouseup');

        var range2 = createRange(sandbox.textNodes().get(1), sandbox.textNodes().get(1), 7, 16);
        var range2ExpectedText = 'sit amet.';
        equal(range2.toString(), range2ExpectedText, 'Range 2 text is valid');
        sandbox.trigger('mouseup');
        assertHighlightsCount(2);
        assertHighlightedText(0, range1ExpectedText);
        assertHighlightedText(1, range2ExpectedText);

        var range3 = createRange(sandbox.textNodes().get(0), sandbox.textNodes().get(2), 6, 3);
        var range3ExpectedText = 'ipsum dolor sit';
        equal(range3.toString(), range3ExpectedText, 'Range 3 text is valid');
        sandbox.trigger('mouseup');
        assertHighlightsCount(1);
        assertHighlightedText(0, sandboxExpectedText);

        equal(sandbox.text(), sandboxExpectedText, 'Sandbox text is valid');
    });

    /********************************************************
     *
     * HELPER METHODS
     *
     *******************************************************/

    function createEmptyRange() {
        return document.createRange
            ? document.createRange() : rangy.createRange();
    }

    function createRange(startContainer, endContainer, startOffset, endOffset) {
        var range = rangy.createRange();
        range.setStart(startContainer, startOffset);
        range.setEnd(endContainer, endOffset);
        rangy.getSelection().addRange(range);
        return range;
    }

    function createTextNodeWithRange(txt, selectedTxt) {
        var txtNode = document.createTextNode(txt);
        var startOffset = txt.indexOf(selectedTxt);
        var endOffset = startOffset + selectedTxt.length;
        sandbox.append(txtNode);
        var range = createRange(txtNode, txtNode, startOffset, endOffset);

        return { node: txtNode, range: range };
    }

    $.fn.textNodes = function() {
        var ret = [];
        this.contents().each(function getChildTextNodes() {
            if (this.nodeType == 3) {
                ret.push( this );
            } else {
                $(this).contents().each(getChildTextNodes);
            }
        });
        return $(ret);
    }

    function rgb2hex(rgb) {
        var rgbArray = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!rgbArray) return rgb;
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(rgbArray[1]) + hex(rgbArray[2]) + hex(rgbArray[3]);
    }

    function assertTextNodeWithRange(node, range, nodeTxt, rangeTxt) {
        equal(node.nodeValue, nodeTxt, 'Node text is valid');
        equal(range.toString(), rangeTxt, 'Range text is valid');
    }

    function assertHighlightsCount(count) {
        var hls = sandbox.find('.' + $.fn.textHighlighter.defaults.highlightedClass);
        equal(hls.length, count, 'Number of highlights is valid');
    }

    function assertHighlightedText(index, txt) {
        var hls = sandbox.find('.' + $.fn.textHighlighter.defaults.highlightedClass);
        equal(hls.eq(index).text(), txt, 'Highlighted text ['+index+'] is valid');
    }
});