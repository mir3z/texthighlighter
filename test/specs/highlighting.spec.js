/* global $, describe, it, afterEach, beforeEach, expect, fixtures, sandbox, TextHighlighter */

describe('Highlighting Range', function () {
    'use strict';

    var hl;

    fixtures.loadFiles([
        'lorem.01',
        'lorem.02',
        'lorem.03',
        'special-tags'
    ]);

    beforeEach(function () {
        hl = sandbox.init();
    });

    afterEach(function () {
        sandbox.empty();
    });

    /**
     * Tests highlighting of ranges
     * Procedure:
     * [1] Load fixture.
     * [2] Create range.
     * [3] Highlight range
     * [4] Check text content of created highlights.
     * @param params
     * @param {string} params.title - test title
     * @param {string} params.fixture - name of the fixture to load
     * @param {function} params.rangeCreator - function which should create range object for this test
     * @param {array} params.expectedHighlights - array of text content of expected highlights
     */
    function testHighlighting(params) {
        it(params.title, function () {
            var markings = sandbox.setFixture(params.fixture),
                range,
                nodes;

            if (markings.node) {
                nodes = markings.node;
            }

            range = params.rangeCreator.apply(this, nodes);

            hl.highlightRange(range, TextHighlighter.createWrapper(hl.options));

            expect(
                hl.getHighlights({ container: sandbox.el }).map(function (h) {
                    return h.textContent;
                })
            ).toEqual(params.expectedHighlights);
        });
    }

    testHighlighting({
        fixture: 'lorem.01',
        title: 'use case #01',
        expectedHighlights: [ 'ipsum' ],
        rangeCreator: function (node) {
            return sandbox.addRange(node.childNodes[0], node.childNodes[0], 6, 11);
        }
    });

    testHighlighting({
        fixture: 'lorem.01',
        title: 'use case #02',
        expectedHighlights: [ 'Lorem' ],
        rangeCreator: function (node) {
            return sandbox.addRange(node.childNodes[0], node.childNodes[0], 0, 5);
        }
    });

    testHighlighting({
        fixture: 'lorem.01',
        title: 'use case #03',
        expectedHighlights: [ 'elit.' ],
        rangeCreator: function (node) {
            return sandbox.addRange(node.childNodes[0], node.childNodes[0], 50, 55);
        }
    });

    testHighlighting({
        fixture: 'lorem.02',
        title: 'use case #04',
        expectedHighlights: [ 'dolor ', 'sit' ],
        rangeCreator: function (node1, node2) {
            return sandbox.addRange(node1.childNodes[0], node2.childNodes[0], 12, 3);
        }
    });

    testHighlighting({
        fixture: 'lorem.02',
        title: 'use case #05',
        expectedHighlights: [ 'amet', ' consectetur' ],
        rangeCreator: function (node1, node2) {
            return sandbox.addRange(node2.childNodes[0], node1.childNodes[2], 4, 12);
        }
    });

    testHighlighting({
        fixture: 'lorem.02',
        title: 'use case #06',
        expectedHighlights: [ 'dolor ', 'sit amet', ' consectetur' ],
        rangeCreator: function (node1) {
            return sandbox.addRange(node1.childNodes[0], node1.childNodes[2], 12, 12);
        }
    });

    testHighlighting({
        fixture: 'lorem.02',
        title: 'use case #07',
        expectedHighlights: [ 'sit amet' ],
        rangeCreator: function (node1, node2) {
            return sandbox.addRange(node2.childNodes[0], node2.childNodes[0], 0, 8);
        }
    });

    testHighlighting({
        fixture: 'lorem.03',
        title: 'use case #08',
        expectedHighlights: [ 'ipsum ', 'dolor', ' sit amet ', 'consectetur', ' adipiscing' ],
        rangeCreator: function (node1) {
            return sandbox.addRange(node1.childNodes[0], node1.childNodes[4], 6, 11);
        }
    });

    testHighlighting({
        fixture: 'lorem.03',
        title: 'use case #09',
        expectedHighlights: [ 'lor', ' sit amet ', 'con' ],
        rangeCreator: function (node1, node2, node3) {
            return sandbox.addRange(node2.childNodes[0], node3.childNodes[0], 2, 3);
        }
    });

    testHighlighting({
        fixture: 'lorem.01',
        title: 'use case #10',
        expectedHighlights: [ ],
        rangeCreator: function (node1) {
            return sandbox.addRange(node1.childNodes[0], node1.childNodes[0], 5, 6);
        }
    });

    testHighlighting({
        fixture: 'lorem.02',
        title: 'use case #11',
        expectedHighlights: [ 'sit amet' ],
        rangeCreator: function (node1) {
            return sandbox.addRange(node1.childNodes[0], node1.childNodes[2], 18, 0);
        }
    });

    testHighlighting({
        fixture: 'special-tags',
        title: 'use case #12',
        expectedHighlights: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O' ],
        rangeCreator: function (node1) {
            return sandbox.addRange(node1.childNodes[0], node1.childNodes[28], 0, 1);
        }
    });

    testHighlighting({
        fixture: 'special-tags',
        title: 'use case #13',
        expectedHighlights: [ 'E' ],
        rangeCreator: function (node1) {
            return sandbox.addRange(node1.childNodes[7].childNodes[0], node1.childNodes[9].childNodes[0], 0, 2);
        }
    });

    testHighlighting({
        fixture: 'special-tags',
        title: 'use case #14',
        expectedHighlights: [ 'B' ],
        rangeCreator: function (node1) {
            return sandbox.addRange(
                node1.childNodes[1].childNodes[0].childNodes[0], node1.childNodes[2], 0, 1);
        }
    });

});