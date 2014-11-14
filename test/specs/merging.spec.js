describe('Merging DOM nodes', function () {
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
        'norm.20'
    ]);

    beforeEach(function () {
        hl = sandbox.init();
    });

    afterEach(function () {
        sandbox.empty();
    });

    function testMerging(params) {
        it('use case #' + params.fixture, function () {
            hl.mergeSiblingHighlights(sandbox.setFixture(params.fixture + '.flat'));

            expect(sandbox.html()).toEqual(fixtures.getAsHtml(params.fixture + '.merge', true));
            expect(sandbox.getTextNodes().length).toEqual(params.expectedTextNodesCount);
        });
    }

    testMerging({ fixture: '01', expectedTextNodesCount: 1 });
    testMerging({ fixture: '02', expectedTextNodesCount: 3 });
    testMerging({ fixture: '03', expectedTextNodesCount: 1 });
    testMerging({ fixture: '04', expectedTextNodesCount: 1 });
    testMerging({ fixture: '05', expectedTextNodesCount: 3 });
    testMerging({ fixture: '06', expectedTextNodesCount: 3 });
    testMerging({ fixture: '07', expectedTextNodesCount: 1 });
    testMerging({ fixture: '08', expectedTextNodesCount: 3 });
    testMerging({ fixture: '09', expectedTextNodesCount: 3 });
    testMerging({ fixture: '10', expectedTextNodesCount: 3 });
    testMerging({ fixture: '11', expectedTextNodesCount: 3 });
    testMerging({ fixture: '12', expectedTextNodesCount: 3 });
    testMerging({ fixture: '13', expectedTextNodesCount: 4 });
    testMerging({ fixture: '14', expectedTextNodesCount: 4 });
    testMerging({ fixture: '15', expectedTextNodesCount: 6 });
    testMerging({ fixture: '16', expectedTextNodesCount: 6 });
    testMerging({ fixture: '17', expectedTextNodesCount: 1 });
    testMerging({ fixture: '18', expectedTextNodesCount: 4 });
    testMerging({ fixture: '19', expectedTextNodesCount: 4 });
    testMerging({ fixture: '20', expectedTextNodesCount: 6 });
});

