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
        'norm.20'
    ]);

    beforeEach(function () {
        hl = sandbox.init();
    });

    afterEach(function () {
        sandbox.empty();
    });

    function testFlattening(params) {
        it('use case #' + params.fixture, function () {
            hl.flattenNestedHighlights(sandbox.setFixture(params.fixture));

            expect(sandbox.html()).toEqual(fixtures.getAsHtml(params.fixture + '.flat', true));
            expect(sandbox.getTextNodes().length).toEqual(params.expectedTextNodesCount);
        });
    }

    testFlattening({ fixture: '01', expectedTextNodesCount: 3 });
    testFlattening({ fixture: '02', expectedTextNodesCount: 3 });
    testFlattening({ fixture: '03', expectedTextNodesCount: 2 });
    testFlattening({ fixture: '04', expectedTextNodesCount: 2 });
    testFlattening({ fixture: '05', expectedTextNodesCount: 4 });
    testFlattening({ fixture: '06', expectedTextNodesCount: 4 });
    testFlattening({ fixture: '07', expectedTextNodesCount: 3 });
    testFlattening({ fixture: '08', expectedTextNodesCount: 5 });
    testFlattening({ fixture: '09', expectedTextNodesCount: 5 });
    testFlattening({ fixture: '10', expectedTextNodesCount: 5 });
    testFlattening({ fixture: '11', expectedTextNodesCount: 5 });
    testFlattening({ fixture: '12', expectedTextNodesCount: 5 });
    testFlattening({ fixture: '13', expectedTextNodesCount: 7 });
    testFlattening({ fixture: '14', expectedTextNodesCount: 7 });
    testFlattening({ fixture: '15', expectedTextNodesCount: 7 });
    testFlattening({ fixture: '16', expectedTextNodesCount: 7 });
    testFlattening({ fixture: '17', expectedTextNodesCount: 1 });
    testFlattening({ fixture: '18', expectedTextNodesCount: 6 });
    testFlattening({ fixture: '19', expectedTextNodesCount: 6 });
    testFlattening({ fixture: '20', expectedTextNodesCount: 7 });
});
