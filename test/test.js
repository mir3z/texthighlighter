$(document).ready(function() {
    var $sandbox = $('#sandbox');

    function setup() {
        $sandbox.textHighlighter();
    }

    function teardown() {
        var hl = $sandbox.getHighlighter();

        if (typeof(hl) !== 'undefined') {
            $sandbox.getHighlighter().destroy();
        }

        $sandbox.empty();
    }

    // =========================================================================

    test('Initialization', function() {
        ok(jQuery(), 'jQuery is loaded');
        ok(jQuery().textHighlighter, 'Plugin is loaded');

        $sandbox.textHighlighter();

        ok($.textHighlighter.defaults, '$.textHighlighter.defaults present');
        ok($.textHighlighter.createWrapper, '$.textHighlighter.createWrapper present');

        equal($sandbox.attr('class'), $.textHighlighter.defaults.contextClass,
              'Context has valid class');

        var attachedEvents = $.data($sandbox.get(0), 'events');
        ok(attachedEvents['mouseup'], 'Event handler for onmouseup is attached');

        $sandbox.textHighlighter('destroy');
    });

    test('Destroying', function() {
        $sandbox.textHighlighter();
        $sandbox.getHighlighter().destroy();

        var attachedEvents = $.data($sandbox.get(0), 'events');
        ok(!attachedEvents, 'Event handlers are detached');

        var defaultContextClass = $.textHighlighter.defaults.contextClass;
        ok(!$sandbox.hasClass(defaultContextClass), "Context has't got '" +
           defaultContextClass + "' class");

        ok(!$sandbox.data('textHighlighter'), 'Data is removed');
    });

    test('Set/Get color', function() {
        $sandbox.textHighlighter();
        var highlighter = $sandbox.getHighlighter();
        var color = '#ff0000';

        highlighter.setColor(color);
        equal(highlighter.getColor(), color, 'getColor is valid');

        var nodeTxt = 'Lorem ipsum dolor sit amet.';
        var rangeTxt = 'ipsum';
        var nodeWithRange = createTextNodeWithRange(nodeTxt, rangeTxt);

        $sandbox.trigger('mouseup');

        assertHighlightsCount(1);
        var hl = $sandbox.children("." + $.textHighlighter.defaults.highlightedClass);
        equal(rgb2hex(hl.css('background-color')), color, 'Highlight color is valid');
    });

    test('Creating default wrapper', function() {
        var $wrapper = $.textHighlighter.createWrapper($.textHighlighter.defaults);
        var wrapperColor = $wrapper.css('background-color')
            || $wrapper.get(0).style.backgroundColor;

        ok($wrapper.html() == '', 'Wrapper is empty');
        equal($wrapper.get(0).tagName, 'SPAN', 'Wrapper has valid tag name');
        equal($wrapper.attr('class'), $.textHighlighter.defaults.highlightedClass,
              'Wrapper has valid class');
        equal(rgb2hex(wrapperColor), $.textHighlighter.defaults.color,
              'Wrapper has valid color');

        teardown();
    });

    test('Creating custom wrapper', function() {
        setup();
        var defaultWrapper = $.textHighlighter.createWrapper;
        $.textHighlighter.createWrapper = function() {
            return $('<span>').addClass('custom-wrapper');
        };

        var nodeTxt = 'Lorem ipsum dolor sit amet.';
        var rangeTxt = 'ipsum';
        var nodeWithRange = createTextNodeWithRange(nodeTxt, rangeTxt);

        $sandbox.trigger('mouseup');

        var $spans = $sandbox.children('span');
        equal($spans.length, 1, 'Number of highlights is valid');
        equal($spans.attr('class'), 'custom-wrapper', 'Highlight class is valid');
        teardown();
        $.textHighlighter.createWrapper = defaultWrapper;
    });
    // =========================================================================

    module('Highlighting plain range', {
        setup: setup,
        teardown: teardown
    });

    function testHighlightingPlainRange(nodeTxt, rangeTxt) {
        var nodeWithRange = createTextNodeWithRange(nodeTxt, rangeTxt);

        assertTextNodeWithRange(nodeWithRange.node, nodeWithRange.range, nodeTxt, rangeTxt);

        $sandbox.trigger('mouseup');

        assertHighlightsCount(1);
        assertHighlightedText(0, rangeTxt);
    }

    test('Simple range in the middle of the container', function() {
        var nodeTxt = 'Lorem ipsum dolor sit amet.';
        var rangeTxt = 'ipsum';
        testHighlightingPlainRange(nodeTxt, rangeTxt);
    });

    test('Simple range at the beginning of the container', function() {
        var nodeTxt = 'Lorem ipsum dolor sit amet.';
        var rangeTxt = 'Lorem';
        testHighlightingPlainRange(nodeTxt, rangeTxt);
    });

    test('Simple range at the end of the container', function() {
        var nodeTxt = 'Lorem ipsum dolor sit amet.';
        var rangeTxt = 'amet.';
        testHighlightingPlainRange(nodeTxt, rangeTxt);
    });

    test('Maximal range within the container', function() {
        var nodeTxt = 'Lorem ipsum dolor sit amet.';
        var rangeTxt = nodeTxt;
        testHighlightingPlainRange(nodeTxt, rangeTxt);
    });

    test('Only whitespace range', function() {
        var nodeTxt = 'Lorem ipsum.';
        var rangeTxt = ' ';
        var nodeWithRange = createTextNodeWithRange(nodeTxt, rangeTxt);

        assertTextNodeWithRange(nodeWithRange.node, nodeWithRange.range, nodeTxt, rangeTxt);

        $sandbox.trigger('mouseup');

        assertHighlightsCount(0);
    });

    // =========================================================================

    module('Highlighting in nested structures', {
        setup: setup,
        teardown: teardown
    });

    function testHighlightingInNestedStructures(args) {
        $sandbox.html(args.sandboxInitHtml);
        var range = createRange($sandbox.textNodes().get(args.startContainer),
                                $sandbox.textNodes().get(args.endContainer),
                                args.startOffset, args.endOffset);
        equal(range.toString(), args.expectedRange, 'Range text is valid');

        $sandbox.trigger('mouseup');

        assertHighlights(args.expectedHighlights);
        ok($sandbox.text() == args.sandboxExpectedText, 'Sandbox text is valid');
    }

    // Lorem |ipsum <b>dolor| sit</b> amet.
    test('Lorem |ipsum &lt;b&gt;dolor| sit&lt;/b&gt; amet.', function() {
        testHighlightingInNestedStructures({
            sandboxInitHtml: 'Lorem ipsum <b>dolor sit</b> amet.',
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.',
            startContainer: 0,
            endContainer: 1,
            startOffset: 6,
            endOffset: 5,
            expectedRange: 'ipsum dolor',
            expectedHighlights: ['ipsum ', 'dolor']
        });
    });

    // Lorem ipsum <b>dolor |sit</b> amet.|
    test('Lorem ipsum &lt;b&gt;dolor |sit&lt;/b&gt; amet.|', function() {
        testHighlightingInNestedStructures({
            sandboxInitHtml: 'Lorem ipsum <b>dolor sit</b> amet.',
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.',
            startContainer: 1,
            endContainer: 2,
            startOffset: 6,
            endOffset: 6,
            expectedRange: 'sit amet.',
            expectedHighlights: ['sit', ' amet.']
        });
    });

    // Lorem ipsum |<b>dolor sit</b>| amet.
    test('Lorem ipsum |&lt;b&gt;dolor sit&lt;/b&gt;| amet.', function() {
        testHighlightingInNestedStructures({
            sandboxInitHtml: 'Lorem ipsum <b>dolor sit</b> amet.',
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.',
            startContainer: 0,
            endContainer: 2,
            startOffset: 12,
            endOffset: 0,
            expectedRange: 'dolor sit',
            expectedHighlights: ['dolor sit']
        });
    });

    // |Lorem ipsum <b>dolor sit</b> amet.|
    test('|Lorem ipsum &lt;b&gt;dolor sit&lt;/b&gt; amet.|', function() {
        testHighlightingInNestedStructures({
            sandboxInitHtml: 'Lorem ipsum <b>dolor sit</b> amet.',
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.',
            startContainer: 0,
            endContainer: 2,
            startOffset: 0,
            endOffset: 6,
            expectedRange: 'Lorem ipsum dolor sit amet.',
            expectedHighlights: ['Lorem ipsum ', 'dolor sit', ' amet.']
        });
    });

    // Lorem <b>ip|sum</b> dolor <b>si|t</b> amet.
    test('Lorem &lt;b&gt;ip|sum&lt;/b&gt; dolor &lt;b&gt;si|t&lt;/b&gt; amet.', function() {
        testHighlightingInNestedStructures({
            sandboxInitHtml: 'Lorem <b>ipsum</b> dolor <b>sit</b> amet.',
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.',
            startContainer: 1,
            endContainer: 3,
            startOffset: 2,
            endOffset: 2,
            expectedRange: 'sum dolor si',
            expectedHighlights: ['sum', ' dolor ', 'si']
        });
    });

    // Lorem <b>ipsum|</b> dolor <b>|sit</b> amet.
    test('Lorem &lt;b&gt;ipsum|&lt;/b&gt dolor &lt;b&gt;|sit&lt;/b&gt amet.', function() {
        testHighlightingInNestedStructures({
            sandboxInitHtml: 'Lorem <b>ipsum</b> dolor <b>sit</b> amet.',
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.',
            startContainer: 1,
            endContainer: 3,
            startOffset: 5,
            endOffset: 0,
            expectedRange: ' dolor ',
            expectedHighlights: [' dolor ']
        });
    });

    // |Lorem <b>ipsum</b> dolor <b>sit</b> amet.|
    test('|Lorem &lt;b&gt;ipsum&lt;/b&gt; dolor &lt;b&gt;sit&lt;/b&gt; amet.|', function() {
        testHighlightingInNestedStructures({
            sandboxInitHtml: 'Lorem <b>ipsum</b> dolor <b>sit</b> amet.',
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.',
            startContainer: 0,
            endContainer: 4,
            startOffset: 0,
            endOffset: 6,
            expectedRange: 'Lorem ipsum dolor sit amet.',
            expectedHighlights: ['Lorem ', 'ipsum', ' dolor ', 'sit', ' amet.']
        });
    });

    // |Lorem <b>ipsum <i>dolor|</i> sit</b> amet.
    test('|Lorem &lt;b&gt;ipsum &lt;i&gt;dolor|&lt;/i&gt; sit&lt;/b&gt; amet.', function() {
        testHighlightingInNestedStructures({
            sandboxInitHtml: 'Lorem <b>ipsum <i>dolor</i> sit</b> amet.',
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.',
            startContainer: 0,
            endContainer: 2,
            startOffset: 0,
            endOffset: 5,
            expectedRange: 'Lorem ipsum dolor',
            expectedHighlights: ['Lorem ', 'ipsum ', 'dolor']
        });
    });

    // Lorem <b>ipsum <i>|dolor</i> sit</b> amet.|
    test('Lorem &lt;b&gt;ipsum &lt;i&gt;|dolor&lt;/i&gt; sit&lt;/b&gt; amet.|', function() {
        testHighlightingInNestedStructures({
            sandboxInitHtml: 'Lorem <b>ipsum <i>dolor</i> sit</b> amet.',
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.',
            startContainer: 2,
            endContainer: 4,
            startOffset: 0,
            endOffset: 6,
            expectedRange: 'dolor sit amet.',
            expectedHighlights: ['dolor', ' sit', ' amet.']
        });
    });

    // =========================================================================

    module('Special cases', {
        setup: setup,
        teardown: teardown
    });

    test('Range contains select tag', function() {
        var sandboxInitHtml = 'Lorem <select><option>ipsum</option></select> dolor.';
        var sandboxExpectedText = 'Lorem ipsum dolor.';

        $sandbox.html(sandboxInitHtml);
        var range = createRange($sandbox.textNodes().get(0), $sandbox.textNodes().get(2), 0, 7);
        equal(range.toString(), sandboxExpectedText, 'Range text is valid');

        $sandbox.trigger('mouseup');

        assertHighlights(['Lorem ', ' dolor.']);
        ok($sandbox.text() == sandboxExpectedText, 'Sandbox text is valid');
    });

    test('End container is not text node', function() {
        var sandboxInitHtml = '<p>Lorem <span>ipsum</span> dolor.';
        var sandboxExpectedText = 'Lorem ipsum dolor.';

        $sandbox.html(sandboxInitHtml);
        var range = createRange(
            $sandbox.textNodes().get(0),
            $sandbox.children('p').get(0).childNodes.item(1),
            0, 1
        );
        equal(range.toString(), 'Lorem ipsum', 'Range text is valid');

        $sandbox.trigger('mouseup');

        assertHighlights(['Lorem ', 'ipsum']);
        ok($sandbox.text() == sandboxExpectedText, 'Sandbox text is valid');
    });

    test('Start container is not text node', function() {
        var sandboxInitHtml = '<p>Lorem <span>ipsum</span> dolor.';
        var sandboxExpectedText = 'Lorem ipsum dolor.';

        $sandbox.html(sandboxInitHtml);
        var range = createRange(
            $sandbox.children('p').get(0).childNodes.item(1),
            $sandbox.textNodes().get(2),
            0, 7
        );
        equal(range.toString(), 'ipsum dolor.', 'Range text is valid');

        $sandbox.trigger('mouseup');

        assertHighlights(['ipsum', ' dolor.']);
        ok($sandbox.text() == sandboxExpectedText, 'Sandbox text is valid');
    });

    // =========================================================================

    module('Single-color normalization', {
        setup: setup,
        teardown: teardown
    });

    /**
     * [..] - denotes first highlight
     * {..} - second highlight
     * (..) - third highlight
     */

    function testNormalization(args) {
        $sandbox.html(args.sandboxInitHtml);

        $.each(args.highlights, function(index, hl) {
            var range = createRange($sandbox.textNodes().get(hl.startContainer),
                                    $sandbox.textNodes().get(hl.endContainer),
                                    hl.startOffset, hl.endOffset);
            var rangeRangeExpectedText = hl.rangeExpectedText;
            equal(range.toString(), hl.rangeExpectedText, 'Range ' + index + ' text is valid');

            if (hl.color) {
                $sandbox.getHighlighter().setColor(hl.color);
            }
            $sandbox.trigger('mouseup');
            assertHighlights(hl.expectedHighlights);
            return true;
        });

        equal($sandbox.text(), args.sandboxExpectedText, 'Sandbox text is valid');
    }

    // <p>Lorem [ipsum {dolor} sit] amet.</p>
    test('&lt;p&gt;Lorem [ipsum {dolor} sit] amet.&lt;/p&gt;', function() {
        testNormalization({
            sandboxInitHtml: '<p>Lorem ipsum dolor sit amet.</p>',
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.',
            highlights: [
                {
                    startContainer: 0,
                    endContainer: 0,
                    startOffset: 6,
                    endOffset: 21,
                    rangeExpectedText: 'ipsum dolor sit',
                    expectedHighlights: ['ipsum dolor sit']
                },
                {
                    startContainer: 1,
                    endContainer: 1,
                    startOffset: 6,
                    endOffset: 11,
                    rangeExpectedText: 'dolor',
                    expectedHighlights: ['ipsum dolor sit']
                }
            ]
        });
    });

    // <p>Lorem {ipsum [dolor] sit} amet.</p>
    test('&lt;p&gt;Lorem {ipsum [dolor] sit} amet.&lt;/p&gt;', function() {
        testNormalization({
            sandboxInitHtml: '<p>Lorem ipsum dolor sit amet.</p>',
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.',
            highlights: [
                {
                    startContainer: 0,
                    endContainer: 0,
                    startOffset: 12,
                    endOffset: 17,
                    rangeExpectedText: 'dolor',
                    expectedHighlights: ['dolor']
                },
                {
                    startContainer: 0,
                    endContainer: 2,
                    startOffset: 6,
                    endOffset: 4,
                    rangeExpectedText: 'ipsum dolor sit',
                    expectedHighlights: ['ipsum dolor sit']
                }
            ]
        });
    });

    // <p>Lorem {ipsum [dolor} sit amet.]</p>
    test('&lt;p&gt;Lorem {ipsum [dolor} sit amet.]&lt;/p&gt;', function() {
        testNormalization({
            sandboxInitHtml: '<p>Lorem ipsum dolor sit amet.</p>',
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.',
            highlights: [
                {
                    startContainer: 0,
                    endContainer: 0,
                    startOffset: 12,
                    endOffset: 27,
                    rangeExpectedText: 'dolor sit amet.',
                    expectedHighlights: ['dolor sit amet.']
                },
                {
                    startContainer: 0,
                    endContainer: 1,
                    startOffset: 6,
                    endOffset: 5,
                    rangeExpectedText: 'ipsum dolor',
                    expectedHighlights: ['ipsum dolor sit amet.']
                }
            ]
        });
    });

    // [Lorem ip]{sum dolor} sit amet.
    test('&lt;p&gt;[Lorem ip]{sum dolor} sit amet.&lt;/p&gt;', function() {
        testNormalization({
            sandboxInitHtml: '<p>Lorem ipsum dolor sit amet.</p>',
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.',
            highlights: [
                {
                    startContainer: 0,
                    endContainer: 0,
                    startOffset: 0,
                    endOffset: 8,
                    rangeExpectedText: 'Lorem ip',
                    expectedHighlights: ['Lorem ip']
                },
                {
                    startContainer: 1,
                    endContainer: 1,
                    startOffset: 0,
                    endOffset: 9,
                    rangeExpectedText: 'sum dolor',
                    expectedHighlights: ['Lorem ipsum dolor']
                }
            ]
        });
    });

    // <p>[Lorem (ipsum] dolor {sit) amet.}</p>
    test('&lt;p&gt;[Lorem (ipsum] dolor {sit) amet.}&lt;/p&gt;', function() {
        testNormalization({
            sandboxInitHtml: '<p>Lorem ipsum dolor sit amet.</p>',
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.',
            highlights: [
                {
                    startContainer: 0,
                    endContainer: 0,
                    startOffset: 0,
                    endOffset: 11,
                    rangeExpectedText: 'Lorem ipsum',
                    expectedHighlights: ['Lorem ipsum']
                },
                {
                    startContainer: 1,
                    endContainer: 1,
                    startOffset: 7,
                    endOffset: 16,
                    rangeExpectedText: 'sit amet.',
                    expectedHighlights: ['Lorem ipsum', 'sit amet.']
                },
                {
                    startContainer: 0,
                    endContainer: 2,
                    startOffset: 6,
                    endOffset: 3,
                    rangeExpectedText: 'ipsum dolor sit',
                    expectedHighlights: ['Lorem ipsum dolor sit amet.']
                }
            ]
        });
    });

    // =========================================================================

    module('Multi-color normalization', {
        setup: setup,
        teardown: teardown
    });

    var color = {
        red: '#ff6666',
        green: '#66ff66',
        blue: '#6666ff'
    };

    /**
     * [..] - denotes first highlight
     * {..} - second highlight
     * (..) - third highlight
     * Each highlight has a different color
     */

    // <p>Lorem {ipsum [dolor} sit] amet.}</p>
    test('&lt;p&gt;Lorem {ipsum [dolor} sit] amet.&lt;/p&gt;', function() {
        createHighlights({
            sandboxInitHtml: '<p>Lorem ipsum dolor sit amet.</p>',
            highlights: [
                {
                    startContainer: 0,
                    endContainer: 0,
                    startOffset: 12,
                    endOffset: 21,
                    rangeExpectedText: 'dolor sit',
                    color: color.red
                },
                {
                    startContainer: 0,
                    endContainer: 1,
                    startOffset: 6,
                    endOffset: 5,
                    rangeExpectedText: 'ipsum dolor',
                    color: color.green
                }
            ]
        });

        assertHighlightsWithColor([
            { text: 'ipsum dolor', color: color.green },
            { text: ' sit', color: color.red }
        ]);
    });

    // <p>Lorem [ipsum {dolor] sit} amet.</p>
    test('&lt;p&gt;Lorem [ipsum {dolor] sit} amet.&lt;/p&gt;', function() {
        createHighlights({
            sandboxInitHtml: '<p>Lorem ipsum dolor sit amet.</p>',
            highlights: [
                {
                    startContainer: 0,
                    endContainer: 0,
                    startOffset: 6,
                    endOffset: 17,
                    rangeExpectedText: 'ipsum dolor',
                    color: color.red
                },
                {
                    startContainer: 1,
                    endContainer: 2,
                    startOffset: 6,
                    endOffset: 4,
                    rangeExpectedText: 'dolor sit',
                    color: color.green
                }
            ]
        });

        assertHighlightsWithColor([
            { text: 'ipsum ', color: color.red },
            { text: 'dolor sit', color: color.green }
        ]);
    });

    // <p>Lorem [ipsum {dolor} sit] amet.</p>
    test('&lt;p&gt;Lorem [ipsum {dolor} sit] amet.&lt;/p&gt;', function() {
        createHighlights({
            sandboxInitHtml: '<p>Lorem ipsum dolor sit amet.</p>',
            highlights: [
                {
                    startContainer: 0,
                    endContainer: 0,
                    startOffset: 6,
                    endOffset: 21,
                    rangeExpectedText: 'ipsum dolor sit',
                    color: color.red
                },
                {
                    startContainer: 1,
                    endContainer: 1,
                    startOffset: 6,
                    endOffset: 11,
                    rangeExpectedText: 'dolor',
                    color: color.green
                }
            ]
        });

        assertHighlightsWithColor([
            { text: 'ipsum dolor sit', color: color.red },
            { text: 'dolor', color: color.green }
        ]);
    });

    // <p>Lor(em [ip)sum dol{or] sit} amet.</p>
    test('&lt;p&gt;Lor(em [ip)sum dol{or] sit} amet.&lt;/p&gt;', function() {
        createHighlights({
            sandboxInitHtml: '<p>Lorem ipsum dolor sit amet.</p>',
            highlights: [
                {
                    startContainer: 0,
                    endContainer: 0,
                    startOffset: 6,
                    endOffset: 17,
                    rangeExpectedText: 'ipsum dolor',
                    color: color.red
                },
                {
                    startContainer: 1,
                    endContainer: 2,
                    startOffset: 9,
                    endOffset: 4,
                    rangeExpectedText: 'or sit',
                    color: color.green
                },
                {
                    startContainer: 0,
                    endContainer: 1,
                    startOffset: 3,
                    endOffset: 2,
                    rangeExpectedText: 'em ip',
                    color: color.blue
                }
            ]
        });

        assertHighlightsWithColor([
            { text: 'em ip', color: color.blue },
            { text: 'sum dol', color: color.red },
            { text: 'or sit', color: color.green }
        ]);
    });

    // https://github.com/mir3z/jquery.texthighlighter/issues/1
    // <p>Lor{em [ip}sum dol{or] sit} amet.</p> right -> left
    test('&lt;p&gt;Lor{em [ip}sum dol{or] sit} amet.&lt;/p&gt;', function() {
        createHighlights({
            sandboxInitHtml: '<p>Lorem ipsum dolor sit amet.</p>',
            highlights: [
                {
                    startContainer: 0,
                    endContainer: 0,
                    startOffset: 6,
                    endOffset: 17,
                    rangeExpectedText: 'ipsum dolor',
                    color: color.red
                },
                {
                    startContainer: 1,
                    endContainer: 2,
                    startOffset: 9,
                    endOffset: 4,
                    rangeExpectedText: 'or sit',
                    color: color.green
                },
                {
                    startContainer: 0,
                    endContainer: 1,
                    startOffset: 3,
                    endOffset: 2,
                    rangeExpectedText: 'em ip',
                    color: color.green
                }
            ]
        });

        assertHighlightsWithColor([
            { text: 'em ip', color: color.green },
            { text: 'sum dol', color: color.red },
            { text: 'or sit', color: color.green }
        ]);
    });

    // https://github.com/mir3z/jquery.texthighlighter/issues/1
    // <p>Lor{em [ip}sum dol{or] sit} amet.</p> left -> right
    test('&lt;p&gt;Lor{em [ip}sum dol{or] sit} amet.&lt;/p&gt;', function() {
        createHighlights({
            sandboxInitHtml: '<p>Lorem ipsum dolor sit amet.</p>',
            highlights: [
                {
                    startContainer: 0,
                    endContainer: 0,
                    startOffset: 6,
                    endOffset: 17,
                    rangeExpectedText: 'ipsum dolor',
                    color: color.red
                },
                {
                    startContainer: 0,
                    endContainer: 1,
                    startOffset: 3,
                    endOffset: 2,
                    rangeExpectedText: 'em ip',
                    color: color.green
                },
                {
                    startContainer: 2,
                    endContainer: 3,
                    startOffset: 7,
                    endOffset: 4,
                    rangeExpectedText: 'or sit',
                    color: color.green
                }
            ]
        });

        assertHighlightsWithColor([
            { text: 'em ip', color: color.green },
            { text: 'sum dol', color: color.red },
            { text: 'or sit', color: color.green }
        ]);
    });

    // =========================================================================

    module('Iframes', {
        setup: function() {},
        teardown: function() {}
    });

    test('Simple', function() {
        stop();

        var sandboxInitHtml = '<iframe id="frame" name="frame"></iframe>';
        $sandbox.html(sandboxInitHtml);

        $('#frame').load(function() {
            var frameWnd = window.frames['frame'];
            var frameBody = $(this).contents().find('body');

            frameBody.append('<p>Lorem ipsum dolor sit amet.</p>');
            frameBody.textHighlighter();

            equal(frameBody.attr('class'), $.textHighlighter.defaults.contextClass,
                'Context has valid class');

            var txtNode = frameBody.find('p').contents().get(0);
            var range = createRange(txtNode, txtNode, 0, 11, frameWnd);
            var rangeExpectedText = "Lorem ipsum";
            equal(range.toString(), rangeExpectedText, 'Range text is valid');

            frameBody.trigger('mouseup');

            assertHighlightsCount(1, frameBody);
            assertHighlightedText(0, rangeExpectedText, frameBody);

            start();
        });

        $('#frame').attr('src', 'about:blank');
    });

    // =========================================================================

    module('', {
        setup: function() {},
        teardown: function() {}
    });

    test('Multiple instances', function() {
        var sandboxInitHtml = '<p id="p1">Lorem ipsum</p><p id="p2">dolor sit amet.</p>';
        $sandbox.html(sandboxInitHtml);

        $sandbox.children("#p1").textHighlighter({
            color: '#FF6666'
        });
        $sandbox.children("#p2").textHighlighter({
            color: '#66FF66'
        });

        var range1 = createRange($sandbox.textNodes().get(0), $sandbox.textNodes().get(0), 0, 5);
        var range1ExpectedText = 'Lorem';
        equal(range1.toString(), range1ExpectedText, 'Range 1 text is valid');
        $sandbox.children("#p1").trigger('mouseup');

        var range2 = createRange($sandbox.textNodes().get(2), $sandbox.textNodes().get(2), 0, 5);
        var range2ExpectedText = 'dolor';
        equal(range2.toString(), range2ExpectedText, 'Range 2 text is valid');
        $sandbox.children("#p2").trigger('mouseup');

        assertHighlightsCount(2);
        assertHighlightedText(0, range1ExpectedText);
        assertHighlightedText(1, range2ExpectedText);

        var color1 = $('span.' + $.textHighlighter.defaults.highlightedClass)
            .eq(0).css('backgroundColor');
        var color2 = $('span.' + $.textHighlighter.defaults.highlightedClass)
            .eq(1).css('backgroundColor');

        notEqual(color1, color2, "Colors are not equal");
        $sandbox.empty();
    });

    // =========================================================================

    module('Removing highlights', {
        setup: setup,
        teardown: teardown
    });

    var c = $.textHighlighter.defaults.highlightedClass;

    function testRemovingHighlights(opts) {
        $sandbox = opts.sandbox;
        $sandbox.getHighlighter().removeHighlights(opts.remove || $sandbox);
        assertHighlightsCount(opts.highlightsCount || 0);
        equal($sandbox.text(), opts.sandboxExpectedText, 'Sandbox text is valid');
        assertTextNodesCount(opts.textNodesCount || 1, $sandbox);
    }

    test('Simple', function() {
        testRemovingHighlights({
            sandbox: $sandbox
                .append('Lorem ')
                .append($('<span>ipsum</span>').addClass(c))
                .append(' dolor sit amet.'),
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.',
            highlightsCount: 0
        });
    });

    test('Highlight at the beginning', function() {
        testRemovingHighlights({
            sandbox: $sandbox
                .append($('<span>Lorem</span>').addClass(c))
                .append(' ipsum dolor sit amet.'),
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.'
        });
    });

    test('Highlight at the end', function() {
        testRemovingHighlights({
            sandbox: $sandbox
                .append('Lorem ipsum dolor sit ')
                .append($('<span>amet.</span>').addClass(c)),
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.'
        });
    });

    test('Multiple highlights', function() {
        testRemovingHighlights({
            sandbox: $sandbox
                .append($('<span>Lorem</span>').addClass(c))
                .append(' ipsum ')
                .append($('<span>dolor</span>').addClass(c))
                .append(' sit ')
                .append($('<span>amet.</span>').addClass(c)),
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.'
        });
    });

    test('Removing specific highlight', function() {
        testRemovingHighlights({
            sandbox: $sandbox
                .append('Lorem ')
                .append($('<span>ipsum</span>').addClass(c))
                .append(' dolor ')
                .append($('<span>sit</span>').addClass(c))
                .append(' amet.'),
            sandboxExpectedText: 'Lorem ipsum dolor sit amet.',
            remove: $sandbox.find('span:first'),
            textNodesCount: 3,
            highlightsCount: 1
        });
    });

    // =========================================================================

    module('Events and callbacks', {
        setup: function() {},
        teardown: teardown
    });
    var c = $.textHighlighter.defaults.highlightedClass;

    test('onRemoveHighlight handler returns true', function() {
        $sandbox.textHighlighter({
            onRemoveHighlight: function() {
                return true;
            }
        });

        $sandbox
            .append($('<span>Lorem</span>').addClass(c))
            .append(' ipsum ')
            .append($('<span>dolor</span>').addClass(c))
            .append(' sit ')
            .append($('<span>amet.</span>').addClass(c));
        var sandboxExpectedText = 'Lorem ipsum dolor sit amet.'

        $sandbox.getHighlighter().removeHighlights();

        assertHighlightsCount(0);
        equal($sandbox.text(), sandboxExpectedText, 'Sandbox text is valid');
        assertTextNodesCount(1, $sandbox);
    });

    test('onRemoveHighlight handler returns false', function() {
        $sandbox.textHighlighter({
            onRemoveHighlight: function() {
                return false;
            }
        });

        var c = $.textHighlighter.defaults.highlightedClass;
        $sandbox
            .append($('<span>Lorem</span>').addClass(c))
            .append(' ipsum ')
            .append($('<span>dolor</span>').addClass(c))
            .append(' sit ')
            .append($('<span>amet.</span>').addClass(c));
        var sandboxExpectedText = 'Lorem ipsum dolor sit amet.'

        $sandbox.getHighlighter().removeHighlights();

        assertHighlightsCount(3);
        equal($sandbox.text(), sandboxExpectedText, 'Sandbox text is valid');
    });

    test('onRemoveHighlight param passing', function() {
        var hlExpectedText = "Lorem ipsum";

        $sandbox.textHighlighter({
            onRemoveHighlight: function(hl) {
                equal($(hl).text(), hlExpectedText, 'Passed highlight is valid');
            }
        });

        var c = $.textHighlighter.defaults.highlightedClass;
        $sandbox
            .append($('<span>'+ hlExpectedText+ '</span>').addClass(c))
            .append(' dolor sit amet.')
        var sandboxExpectedText = 'Lorem ipsum dolor sit amet.'

        $sandbox.getHighlighter().removeHighlights();
    });

    test('onBeforeHighlight returns true', function() {
        $sandbox.textHighlighter({
            onBeforeHighlight: function() {
                return true;
            }
        });

        var sandboxInitText = 'Lorem ipsum dolor sit amet.';

        $sandbox.html(sandboxInitText);
        createRange($sandbox.textNodes().get(0), $sandbox.textNodes().get(0), 0, 5);

        $sandbox.trigger('mouseup');

        assertHighlightsCount(1);
        assertHighlightedText(0, 'Lorem');
    });

    test('onBeforeHighlight returns false', function() {
        $sandbox.textHighlighter({
            onBeforeHighlight: function() {
                return false;
            }
        });

        var sandboxInitText = 'Lorem ipsum dolor sit amet.';

        $sandbox.html(sandboxInitText);
        createRange($sandbox.textNodes().get(0), $sandbox.textNodes().get(0), 0, 5);

        $sandbox.trigger('mouseup');

        assertHighlightsCount(0);
    });

    test('onBeforeHighlight param passing', function() {
        var rangeExpectedText = 'Lorem';

        $sandbox.textHighlighter({
            onBeforeHighlight: function(range) {
                equal(range.toString(), rangeExpectedText, 'Passed range is valid');
            }
        });

        var sandboxInitText = 'Lorem ipsum dolor sit amet.';

        $sandbox.html(sandboxInitText);
        createRange($sandbox.textNodes().get(0), $sandbox.textNodes().get(0), 0, 5);

        $sandbox.trigger('mouseup');
    });

    test('onAfterHighlight', function() {
        $sandbox.textHighlighter({
            onAfterHighlight: function(hls, range) {
                equal(hls.length, 1, 'Highlights length is valid');
                equal($(hls[0]).text(), 'ipsum', 'Text is valid');
                equal(range.toString(), 'ipsum', 'Range text is valid');
            }
        });

        $sandbox.text('Lorem ipsum dolor sit amet.');
        createRange($sandbox.textNodes().get(0), $sandbox.textNodes().get(0), 6, 11);
        $sandbox.trigger('mouseup');
    });

    // =========================================================================

    module('Serialization', {
        setup: setup,
        teardown: teardown
    });

    function testSerialization(params) {
        createHighlights(params);

        var hl = $sandbox.getHighlighter();
        var highlights = hl.getAllHighlights($sandbox);
        var jsonStr = hl.serializeHighlights();
        var json = JSON.parse(jsonStr);
        var expectedHtml = $sandbox.html();

        $sandbox.html(params.sandboxInitHtml);
        var deserializedHighlights = hl.deserializeHighlights(jsonStr);
        var actualHtml = $sandbox.html();
        var serializedText = ($.map(json, function (val) { return val[1]; })).join('');
        var expectedText = ($.map(params.highlights, function (val) { return val.rangeExpectedText; })).join('');

        equal(expectedHtml, actualHtml, 'Serialization and deserialization successful');
        equal(highlights.length, deserializedHighlights.length, 'All highlights deserialized');
        equal(serializedText, expectedText, 'Highlights text ok');
    }

    test('Serialize one highlight', function() {
        testSerialization({
            sandboxInitHtml: '<p>Lorem ipsum dolor sit amet.</p>',
            highlights: [{
                startContainer: 0,
                endContainer: 0,
                startOffset: 6,
                endOffset: 11,
                rangeExpectedText: 'ipsum',
                color: color.red
            }]
        });
    });

    test('Serialize multiple highlights', function() {
        testSerialization({
            sandboxInitHtml: '<p>Lorem ipsum dolor sit amet.</p>',
            highlights: [{
                startContainer: 0,
                endContainer: 0,
                startOffset: 0,
                endOffset: 5,
                rangeExpectedText: 'Lorem',
                color: color.red
            }, {
                startContainer: 1,
                endContainer: 1,
                startOffset: 7,
                endOffset: 12,
                rangeExpectedText: 'dolor',
                color: color.green
            }, {
                startContainer: 3,
                endContainer: 3,
                startOffset: 5,
                endOffset: 10,
                rangeExpectedText: 'amet.',
                color: color.blue
            }]
        });
    });

    test('Serialization on splitted highlight 1', function() {
        testSerialization({
            sandboxInitHtml: '<p>Lorem ipsum <b>dolor sit</b> amet.</p>',
            highlights: [{
                startContainer: 0,
                endContainer: 1,
                startOffset: 6,
                endOffset: 5,
                rangeExpectedText: 'ipsum dolor',
                color: color.red
            }]
        });
    });

    test('Serialization on splitted highlight 2', function() {
        testSerialization({
            sandboxInitHtml: '<p>Lorem ipsum <b>dolor sit</b> amet.</p>',
            highlights: [{
                startContainer: 1,
                endContainer: 2,
                startOffset: 6,
                endOffset: 5,
                rangeExpectedText: 'sit amet',
                color: color.red
            }]
        });
    });

    test('Serialization on splitted highlight 3', function() {
        testSerialization({
            sandboxInitHtml: '<p>Lorem ipsum <b>dolor</b> sit amet.</p>',
            highlights: [{
                startContainer: 0,
                endContainer: 2,
                startOffset: 6,
                endOffset: 4,
                rangeExpectedText: 'ipsum dolor sit',
                color: color.red
            }]
        });
    });

    test('Serialization in nested structures 1', function() {
        testSerialization({
            sandboxInitHtml: '<p>Lorem <div>ipsum <b>dolor</b> sit</div> amet.</p>',
            highlights: [{
                startContainer: 0,
                endContainer: 2,
                startOffset: 2,
                endOffset: 3,
                rangeExpectedText: 'rem ipsum dol',
                color: color.red
            }]
        });
    });

    test('Serialization in nested structures 2', function() {
        testSerialization({
            sandboxInitHtml: '<p>Lorem <div>ipsum <b>dolor</b> sit </div>amet.</p>',
            highlights: [{
                startContainer: 2,
                endContainer: 4,
                startOffset: 0,
                endOffset: 3,
                rangeExpectedText: 'dolor sit ame',
                color: color.red
            }]
        });
    });


    /********************************************************
     *
     * HELPER METHODS
     *
     *******************************************************/

    function createEmptyRange(aWindow) {
        var wnd = (typeof(aWindow) != 'undefined' ? aWindow : window);
        var doc = wnd.document;
        return doc.createRange
            ? doc.createRange() : rangy.createRange(doc);
    }

    function getSelection(aWindow) {
        var wnd = (typeof(aWindow) != 'undefined' ? aWindow : window);
        return wnd.getSelection ? wnd.getSelection()
             : window.frame ? rangy.getIframeSelection($('iframe').get(0))
             : rangy.getSelection();
    }

    function createRange(startContainer, endContainer, startOffset, endOffset, aWindow) {
        var wnd = (typeof(aWindow) != 'undefined' ? aWindow : window);

        var range = createEmptyRange(wnd);
        range.setStart(startContainer, startOffset);
        range.setEnd(endContainer, endOffset);
        getSelection(wnd).addRange(range);
        return range;
    }

    function createTextNodeWithRange(txt, selectedTxt) {
        var txtNode = document.createTextNode(txt);
        var startOffset = txt.indexOf(selectedTxt);
        var endOffset = startOffset + selectedTxt.length;
        $sandbox.append(txtNode);
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
    };

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

    function assertHighlightsCount(count, container) {
        var cont = (typeof(container) != 'undefined' ? container : $sandbox);
        var hls = cont.find('.' + $.textHighlighter.defaults.highlightedClass);
        equal(hls.length, count, 'Number of highlights is valid');
    }

    function assertTextNodesCount(count, container) {
        var isTextNode = function() {
            return this.nodeType == 3;
        };
        var txtNodes = $(container)
            .contents()
            .filter(isTextNode)
            .add(
                $(container)
                   .find("*")
                   .contents()
                   .filter(isTextNode)
            );
        equal(txtNodes.length, count, 'Number of text nodes is valid');
    }

    function assertHighlightedText(index, txt, container) {
        var cont = (typeof(container) != 'undefined' ? container : $sandbox);
        var hls = cont.find('.' + $.textHighlighter.defaults.highlightedClass);
        equal(hls.eq(index).text(), txt, 'Highlighted text ['+index+'] is valid');
    }

    function assertHighlightColor(index, color, container) {
        var cont = (typeof(container) != 'undefined' ? container : $sandbox);
        var hls = cont.find('.' + $.textHighlighter.defaults.highlightedClass);
        equal(rgb2hex(hls.eq(index).css('background-color')), color,
              'Highlighted color ['+index+'] is valid');
    }

    function assertHighlights(hls) {
        assertHighlightsCount(hls.length);
        $.each(hls, function(index, value) {
            assertHighlightedText(index, value);
        });
    }

    function assertHighlightsWithColor(hls) {
        assertHighlightsCount(hls.length);
        $.each(hls, function(index, value) {
            assertHighlightedText(index, value.text);
            assertHighlightColor(index, value.color);
        });
    }

    function createHighlights(args) {
        $sandbox.html(args.sandboxInitHtml);

        $.each(args.highlights, function(index, hl) {
            var range = createRange($sandbox.textNodes().get(hl.startContainer),
                                    $sandbox.textNodes().get(hl.endContainer),
                                    hl.startOffset, hl.endOffset);
            var rangeRangeExpectedText = hl.rangeExpectedText;
            equal(range.toString(), hl.rangeExpectedText, 'Range ' + index + ' text is valid');

            if (hl.color) {
                $sandbox.getHighlighter().setColor(hl.color);
            }
            $sandbox.trigger('mouseup');

            return true;
        });
    }
});
