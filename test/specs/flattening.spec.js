/* global describe, it, afterEach, beforeEach, expect, fixtures, sandbox */

describe('Flattening DOM tree', function () {
    'use strict';

    var hl;

    fixtures.loadFiles([
        'norm.01',
        'norm.02',
        'norm.03',
        'norm.04',
        'norm.05',
        'norm.06',
        'norm.07',
        'norm.08',
        'norm.09',
        'norm.10',
        'norm.11',
        'norm.12',
        'norm.13',
        'norm.14',
        'norm.15',
        'norm.16',
        'norm.17',
        'norm.18',
        'norm.19',
        'norm.20',
        'norm.21',
        'norm.22',
        'norm.23'
    ]);

    beforeEach(function () {
        hl = sandbox.init();
    });

    afterEach(function () {
        sandbox.empty();
    });

    /**
     * Tests flattening of the DOM tree after creating highlights.
     * Procedure:
     * [1] Load fixture.
     * [2] Flatten highlights.
     * [3] Check number of text nodes.
     * @param params
     * @param {string} params.title - test title
     * @param {string} params.fixture - name of the fixture to load
     * @param {number} params.expectedTextNodesCount - expected number of text nodes after flattening
     */
    function testFlattening(params) {
        it(params.title, function () {
            hl.flattenNestedHighlights(sandbox.setFixture(params.fixture));

            expect(sandbox.html()).toEqual(fixtures.getAsHtml(params.fixture + '.flat', true));
            expect(sandbox.getTextNodes().length).toEqual(params.expectedTextNodesCount);
        });
    }

    testFlattening({ title: 'use case #01',  fixture: '01', expectedTextNodesCount: 3 });
    testFlattening({ title: 'use case #02',  fixture: '02', expectedTextNodesCount: 3 });
    testFlattening({ title: 'use case #03',  fixture: '03', expectedTextNodesCount: 2 });
    testFlattening({ title: 'use case #04',  fixture: '04', expectedTextNodesCount: 2 });
    testFlattening({ title: 'use case #05',  fixture: '05', expectedTextNodesCount: 4 });
    testFlattening({ title: 'use case #06',  fixture: '06', expectedTextNodesCount: 4 });
    testFlattening({ title: 'use case #07',  fixture: '07', expectedTextNodesCount: 3 });
    testFlattening({ title: 'use case #08',  fixture: '08', expectedTextNodesCount: 5 });
    testFlattening({ title: 'use case #09',  fixture: '09', expectedTextNodesCount: 5 });
    testFlattening({ title: 'use case #10', fixture: '10', expectedTextNodesCount: 5 });
    testFlattening({ title: 'use case #11', fixture: '11', expectedTextNodesCount: 5 });
    testFlattening({ title: 'use case #12', fixture: '12', expectedTextNodesCount: 5 });
    testFlattening({ title: 'use case #13', fixture: '13', expectedTextNodesCount: 7 });
    testFlattening({ title: 'use case #14', fixture: '14', expectedTextNodesCount: 7 });
    testFlattening({ title: 'use case #15', fixture: '15', expectedTextNodesCount: 7 });
    testFlattening({ title: 'use case #16', fixture: '16', expectedTextNodesCount: 7 });
    testFlattening({ title: 'use case #17', fixture: '17', expectedTextNodesCount: 1 });
    testFlattening({ title: 'use case #18', fixture: '18', expectedTextNodesCount: 6 });
    testFlattening({ title: 'use case #19', fixture: '19', expectedTextNodesCount: 6 });
    testFlattening({ title: 'use case #20', fixture: '20', expectedTextNodesCount: 7 });
    testFlattening({ title: 'use case #21', fixture: '21', expectedTextNodesCount: 5 });
    testFlattening({ title: 'use case #22', fixture: '22', expectedTextNodesCount: 5 });
    testFlattening({ title: 'use case #23', fixture: '23', expectedTextNodesCount: 1 });
});

