/* global describe, it, afterEach, beforeEach, expect, fixtures, sandbox, $, TextHighlighter */

describe('Finding', function () {
    'use strict';

    var hl;

    fixtures.loadFiles([
        'lorem.01',
        'lorem.02'
    ]);

    beforeEach(function () {
        hl = sandbox.init();
    });

    afterEach(function () {
        sandbox.empty();
    });

    /**
     * Tests finding&highlighting text phrase.
     * Procedure:
     * [1] Load fixture.
     * [2] Perform search.
     * [3] Check number of created highlights.
     * @param params
     * @param {string} params.title - test title.
     * @param {string} params.fixture - name of the fixture to load.
     * @param {string} params.searchFor - phrase to search.
     * @param {boolean} params.caseSensitive - true is search should be case sensitive.
     * @params {number} params.expectedHighlightsCount - expected number of highlights after searching.
     */
    function testFinding(params) {
        it(params.title, function () {
            sandbox.setFixture(params.fixture);

            hl.find(params.searchFor, params.caseSensitive);

            var highlights = hl.getHighlights({ container: sandbox.el });
            expect(highlights.length).toEqual(params.expectedHighlightsCount);
        });
    }

    testFinding({
        title: 'use case #01',
        fixture: 'lorem.01',
        searchFor: 'or',
        expectedHighlightsCount: 2
    });
    testFinding({
        title: 'use case #02',
        fixture: 'lorem.01',
        searchFor: 'i',
        expectedHighlightsCount: 6
    });
    testFinding({
        title: 'use case #03',
        fixture: 'lorem.01',
        searchFor: 'DOLOR',
        expectedHighlightsCount: 0
    });
    testFinding({
        title: 'use case #04',
        fixture: 'lorem.01',
        caseSensitive: false,
        searchFor: 'DOLOR',
        expectedHighlightsCount: 1
    });
    testFinding({
        title: 'use case #05',
        fixture: 'lorem.02',
        searchFor: 'dolor sit amet',
        expectedHighlightsCount: 2
    });
    testFinding({
        title: 'use case #06',
        fixture: 'lorem.02',
        searchFor: 'sit   amet',
        expectedHighlightsCount: 0
    });
});