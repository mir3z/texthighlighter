describe('Flattening DOM tree', function () {
    'use strict';

    var hl;

    fixtures.load([
        '01', '01.flat',
        '02', '02.flat',
        '03', '03.flat',
        '04', '04.flat',
        '05', '05.flat',
        '06', '06.flat',
        '07', '07.flat',
        '08', '08.flat',
        '09', '09.flat',
        '10', '10.flat',
        '11', '11.flat',
        '12', '12.flat',
        '13', '13.flat',
        '14', '14.flat',
        '15', '15.flat',
        '16', '16.flat',
        '17', '17.flat',
        '18', '18.flat',
        '19', '19.flat',
        '20', '20.flat'
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
