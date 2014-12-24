/* global describe, it, afterEach, beforeEach, expect, fixtures, sandbox, jasmine */

describe('Callbacks', function () {
    'use strict';

    var hl;

    fixtures.loadFiles([
        'lorem.01',
        'lorem.02'
    ]);

    afterEach(function () {
        sandbox.empty();
    });

    /**
     * Tests functioning of the highlighter callbacks.
     * Procedure:
     * [1] Load fixture.
     * [2] Create selection range.
     * [3] Initialize highlighter with defined callbacks.
     * [4] Highlight range. If params.onRemoveHighlight is defined then remove all ranges to trigger callback.
     * [5] Check text content of created highlights.
     * @param params
     * @param {string} params.title - test title
     * @param {string} params.fixture - name of the fixture to load
     * @param {function} params.rangeCreator - function which should create range object for this test
     * @param {function} params.onBeforeHighlight - highlighter callback
     * @param {function} params.onAfterHighlight - highlighter callback
     * @param {function} params.onRemoveHighlight - highlighter callback
     * @param {array} params.expectedHighlights - array of expected highlights text content
     */
    function testCallbacks(params) {

        it(params.title, function () {
            var markings = sandbox.setFixture(params.fixture),
                nodes;

            if (markings.node) {
                nodes = markings.node;
            }

            params.rangeCreator.apply(this, nodes);

            hl = sandbox.init({
                onBeforeHighlight: params.onBeforeHighlight,
                onAfterHighlight: params.onAfterHighlight,
                onRemoveHighlight: params.onRemoveHighlight
            });

            hl.doHighlight();

            if (params.onRemoveHighlight) {
                hl.removeHighlights();
            }

            expect(
                hl.getHighlights({ container: sandbox.el }).map(function (h) {
                    return h.textContent;
                })
            ).toEqual(params.expectedHighlights);
        });
    }

    describe('onBeforeHighlight', function () {

        testCallbacks({
            fixture: 'lorem.01',
            title: 'returns true',
            onBeforeHighlight: function (range) {
                expect(range.toString()).toEqual('ipsum');
                return true;
            },
            expectedHighlights: [ 'ipsum' ],
            rangeCreator: function (node) {
                return sandbox.addRange(node.childNodes[0], node.childNodes[0], 6, 11);
            }
        });

        testCallbacks({
            fixture: 'lorem.01',
            title: 'returns false',
            onBeforeHighlight: function (range) {
                expect(range.toString()).toEqual('ipsum');
                return false;
            },
            expectedHighlights: [],
            rangeCreator: function (node) {
                return sandbox.addRange(node.childNodes[0], node.childNodes[0], 6, 11);
            }
        });

    });

    describe('onAfterHighlight', function () {

        testCallbacks({
            fixture: 'lorem.01',
            title: 'single highlight',
            onAfterHighlight: function (range, highlights, timestamp) {
                expect(range.toString()).toEqual('ipsum');
                expect(highlights.length).toEqual(1);
                expect(highlights[0].textContent).toEqual('ipsum');
                expect(timestamp).toEqual(jasmine.any(Number));
            },
            expectedHighlights: [ 'ipsum' ],
            rangeCreator: function (node) {
                return sandbox.addRange(node.childNodes[0], node.childNodes[0], 6, 11);
            }
        });

        testCallbacks({
            fixture: 'lorem.02',
            title: 'multiple highlights',
            onAfterHighlight: function (range, highlights, timestamp) {
                expect(range.toString()).toEqual('dolor sit amet consectetur');
                expect(highlights.length).toEqual(3);
                expect(
                    highlights.map(function (h) { return h.textContent; })
                ).toEqual([ 'dolor ', 'sit amet', ' consectetur' ]);
                expect(timestamp).toEqual(jasmine.any(Number));
            },
            expectedHighlights: [ 'dolor ', 'sit amet', ' consectetur' ],
            rangeCreator: function (node1) {
                return sandbox.addRange(node1.childNodes[0], node1.childNodes[2], 12, 12);
            }
        });
    });

    describe('onRemoveHighlight', function () {
        testCallbacks({
            fixture: 'lorem.01',
            title: 'returns true',
            onRemoveHighlight: function (highlight) {
                expect(highlight.textContent).toEqual('ipsum');
                return true;
            },
            expectedHighlights: [ ],
            rangeCreator: function (node) {
                return sandbox.addRange(node.childNodes[0], node.childNodes[0], 6, 11);
            }
        });

        testCallbacks({
            fixture: 'lorem.01',
            title: 'returns false',
            onRemoveHighlight: function (highlight) {
                expect(highlight.textContent).toEqual('ipsum');
                return false;
            },
            expectedHighlights: [ 'ipsum' ],
            rangeCreator: function (node) {
                return sandbox.addRange(node.childNodes[0], node.childNodes[0], 6, 11);
            }
        });
    });

});
