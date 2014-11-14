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
        'removing.07',
        'removing.08'
    ]);

    beforeEach(function () {
        hl = sandbox.init();
    });

    afterEach(function () {
        sandbox.empty();
    });


    function testRemoving(params) {
        it('use case ' + params.title, function () {
            var markings = sandbox.setFixture(params.fixture);

            if (params.which) {
                params.which.forEach(function (el) {
                    hl.removeHighlights(markings[el]);
                });
            } else {
                hl.removeHighlights();
            }

            expect(sandbox.getTextNodes().length).toEqual(params.expectedTextNodesCount);
            expect(sandbox.html()).toEqual(fixtures.getAsHtml(params.expectedHTMLFixture, true));
        });
    }

    testRemoving({
        title: '#01',
        fixture: '01.preremove',
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '01.postremove.all'
    });

    testRemoving({
        title: '#02',
        fixture: '02.preremove',
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '02.postremove.all'
    });
    testRemoving({
        title: '#03',
        fixture: '02.preremove',
        which: ['h1'],
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '02.postremove.all'
    });

    testRemoving({
        title: '#04',
        fixture: '02.preremove',
        which: ['h2'],
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '02.postremove.h2'
    });

    testRemoving({
        title: '#05',
        fixture: '03.preremove',
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '03.postremove.all'
    });
    testRemoving({
        title: '#06',
        fixture: '03.preremove',
        which: ['h1'],
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '03.postremove.all'
    });
    testRemoving({
        title: '#07',
        fixture: '03.preremove',
        which: ['h2'],
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '03.postremove.h2'
    });

    testRemoving({
        title: '#08',
        fixture: '04.preremove',
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '04.postremove.all'
    });
    testRemoving({
        title: '#09',
        fixture: '04.preremove',
        which: ['h1'],
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '04.postremove.all'
    });
    testRemoving({
        title: '#10',
        fixture: '04.preremove',
        which: ['h2'],
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '04.postremove.h2'
    });

    testRemoving({
        title: '#11',
        fixture: '05.preremove',
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '05.postremove.all'
    });
    testRemoving({
        title: '#12',
        fixture: '05.preremove',
        which: ['h1'],
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '05.postremove.h1'
    });
    testRemoving({
        title: '#13',
        fixture: '05.preremove',
        which: ['h2'],
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '05.postremove.h2'
    });
    testRemoving({
        title: '#14',
        fixture: '05.preremove',
        which: ['h3'],
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '05.postremove.h3'
    });

    testRemoving({
        title: '#15',
        fixture: '06.preremove',
        expectedTextNodesCount: 1,
        expectedHTMLFixture: '06.postremove.all'
    });

    testRemoving({
        title: '#17',
        fixture: '07.preremove',
        expectedTextNodesCount: 7,
        expectedHTMLFixture: '07.postremove.all'
    });

});
