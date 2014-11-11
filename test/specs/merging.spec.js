describe('Merging DOM nodes', function () {
    'use strict';

    var hl;

    fixtures.load([
        '01.flat', '01.merge',
        '02.flat', '02.merge',
        '03.flat', '03.merge',
        '04.flat', '04.merge',
        '05.flat', '05.merge',
        '06.flat', '06.merge',
        '07.flat', '07.merge',
        '08.flat', '08.merge',
        '09.flat', '09.merge',
        '10.flat', '10.merge',
        '11.flat', '11.merge',
        '12.flat', '12.merge',
        '13.flat', '13.merge',
        '14.flat', '14.merge',
        '15.flat', '15.merge',
        '16.flat', '16.merge',
        '17.flat', '17.merge',
        '18.flat', '18.merge',
        '19.flat', '19.merge',
        '20.flat', '20.merge'
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

