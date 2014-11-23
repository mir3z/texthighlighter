/* global describe, it, afterEach, beforeEach, expect, fixtures, sandbox */

describe('Removing highlights', function () {
    'use strict';

    var hl;

    fixtures.loadFiles([
        'removing.01',
        'removing.02',
        'removing.03',
        'removing.04',
        'removing.05',
        'removing.06',
        'removing.07'
    ]);

    beforeEach(function () {
        hl = sandbox.init();
    });

    afterEach(function () {
        sandbox.empty();
    });

    /**
     * Tests removing of highlights.
     * Procedure:
     * [1] Load fixture.
     * [2] Remove proper highlights (all or from given element).
     * [3] Check number of text nodes.
     * [4] Compare HTML after removing with expected fixture.
     * @param params
     * @param {string} params.title - test title
     * @param {string} params.fixture - name of the fixture to load
     * @param {string} [params.which] - array of nodes from which highlights will be removed
     * @param {number} params.expectedTextNodesCount - expected number of text nodes after removing
     * @param {string} params.expectedHTMLFixture - name of fixture which will be used for comparing expected results
     */
    function testRemoving(params) {
        it(params.title, function () {
            var markings = sandbox.setFixture(params.fixture);

            if (params.which) {
                params.which.forEach(function (el) {
                    hl.removeHighlights(markings[el][0]);
                });
            } else {
                hl.removeHighlights();
            }

            expect(sandbox.getTextNodes().length).toEqual(params.expectedTextNodesCount);
            expect(sandbox.html()).toEqual(fixtures.getAsHtml(params.expectedHTMLFixture, true));
        });
    }

    testRemoving({
        title: 'use case #01',
        fixture: '01.preremove',
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '01.postremove.all'
    });

    testRemoving({
        title: 'use case #02',
        fixture: '02.preremove',
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '02.postremove.all'
    });
    testRemoving({
        title: 'use case #03',
        fixture: '02.preremove',
        which: ['h1'],
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '02.postremove.all'
    });

    testRemoving({
        title: 'use case #04',
        fixture: '02.preremove',
        which: ['h2'],
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '02.postremove.h2'
    });

    testRemoving({
        title: 'use case #05',
        fixture: '03.preremove',
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '03.postremove.all'
    });
    testRemoving({
        title: 'use case #06',
        fixture: '03.preremove',
        which: ['h1'],
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '03.postremove.all'
    });
    testRemoving({
        title: 'use case #07',
        fixture: '03.preremove',
        which: ['h2'],
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '03.postremove.h2'
    });

    testRemoving({
        title: 'use case #08',
        fixture: '04.preremove',
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '04.postremove.all'
    });
    testRemoving({
        title: 'use case #09',
        fixture: '04.preremove',
        which: ['h1'],
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '04.postremove.all'
    });
    testRemoving({
        title: 'use case #10',
        fixture: '04.preremove',
        which: ['h2'],
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '04.postremove.h2'
    });

    testRemoving({
        title: 'use case #11',
        fixture: '05.preremove',
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '05.postremove.all'
    });
    testRemoving({
        title: 'use case #12',
        fixture: '05.preremove',
        which: ['h1'],
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '05.postremove.h1'
    });
    testRemoving({
        title: 'use case #13',
        fixture: '05.preremove',
        which: ['h2'],
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '05.postremove.h2'
    });
    testRemoving({
        title: 'use case #14',
        fixture: '05.preremove',
        which: ['h3'],
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '05.postremove.h3'
    });

    testRemoving({
        title: 'use case #15',
        fixture: '06.preremove',
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '06.postremove.all'
    });

    testRemoving({
        title: 'use case #17',
        fixture: '07.preremove',
        expectedTextNodesCount: 7,
        expectedHTMLFixture: '07.postremove.all'
    });

});
