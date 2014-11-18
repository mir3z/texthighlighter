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

    function testCallbacks(params) {

        it(params.title, function () {
            var markings = sandbox.setFixture(params.fixture),
                nodes;

            if (markings.node) {
                nodes = markings.node.map(function (i, el) { return el; });
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
                hl.getAllHighlights(sandbox.$, true).get().map(function (h) {
                    return h.textContent;
                })
            ).toEqual(params.expectedHighlights);
        });
    }

    describe('onBeforeHighlight', function () {
        var singleNodeRangeCreator = function (node) {
            return sandbox.addRange(node.childNodes[0], node.childNodes[0], 6, 11);
        };

        testCallbacks({
            fixture: 'lorem.01',
            title: 'returns true',
            onBeforeHighlight: function (range) {
                expect(range.toString()).toEqual('ipsum');
                return true;
            },
            expectedHighlights: [ 'ipsum' ],
            rangeCreator: singleNodeRangeCreator
        });

        testCallbacks({
            fixture: 'lorem.01',
            title: 'returns false',
            onBeforeHighlight: function (range) {
                expect(range.toString()).toEqual('ipsum');
                return false;
            },
            expectedHighlights: [],
            rangeCreator: singleNodeRangeCreator
        });

    });

    describe('onAfterHighlight', function () {

        testCallbacks({
            fixture: 'lorem.01',
            title: 'single highlight',
            onAfterHighlight: function (range, highlights) {
                expect(range.toString()).toEqual('ipsum');
                expect(highlights.length).toEqual(1);
                expect(highlights[0].textContent).toEqual('ipsum');
            },
            expectedHighlights: [ 'ipsum' ],
            rangeCreator: function (node) {
                return sandbox.addRange(node.childNodes[0], node.childNodes[0], 6, 11);
            }
        });

        testCallbacks({
            fixture: 'lorem.02',
            title: 'multiple highlights',
            onAfterHighlight: function (range, highlights) {
                expect(range.toString()).toEqual('dolor sit amet consectetur');
                expect(highlights.length).toEqual(3);
                expect(
                    highlights.map(function (h) { return h.textContent })
                ).toEqual(['dolor ', 'sit amet', ' consectetur']);
            },
            expectedHighlights: [ 'dolor ', 'sit amet', ' consectetur' ],
            rangeCreator: function (node1) {
                return sandbox.addRange(node1.childNodes[0], node1.childNodes[2], 12, 12);
            }
        })
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
