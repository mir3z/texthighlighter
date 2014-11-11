describe('Normalization', function () {
    'use strict';

    var hl;

    fixtures.load([
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20'
    ]);

    beforeEach(function () {
        hl = sandbox.init();
    });

    afterEach(function () {
        sandbox.empty();
    });

    function testNormalization(params) {
        it('use case #' + params.fixture, function () {
            var normalized = hl.normalizeHighlights(sandbox.setFixture(params.fixture));

            expect(
                normalized.map(function (h) { return h.textContent })
            ).toEqual(params.highlights);
        });
    }

    testNormalization({ fixture: '01', highlights: [ 'Lorem ipsum dolor sit amet consectetur adipiscing elit.' ] });
    testNormalization({ fixture: '02', highlights: [ 'sit amet' ] });
    testNormalization({ fixture: '03', highlights: [ 'Lorem ipsum dolor sit amet consectetur adipiscing elit.' ] });
    testNormalization({ fixture: '04', highlights: [ 'Lorem ipsum dolor sit amet consectetur adipiscing elit.' ] });
    testNormalization({ fixture: '05', highlights: [ 'dolor sit amet' ] });
    testNormalization({ fixture: '06', highlights: [ 'dolor sit amet' ] });
    testNormalization({ fixture: '07', highlights: [ 'Lorem ipsum dolor sit amet' ] });
    testNormalization({ fixture: '08', highlights: [ 'ipsum dolor sit' ] });
    testNormalization({ fixture: '09', highlights: [ 'Lorem ipsum dolor sit amet.' ] });
    testNormalization({ fixture: '10', highlights: [ 'Lorem ipsum dolor sit amet.' ] });
    testNormalization({ fixture: '11', highlights: [ 'Lorem ipsum dolor sit amet.' ] });
    testNormalization({ fixture: '12', highlights: [ 'Lorem ipsum dolor sit amet.' ] });
    testNormalization({ fixture: '13', highlights: [ 'Lorem ipsum dolor sit amet.' ] });
    testNormalization({ fixture: '14', highlights: [ 'Lorem ipsum dolor sit amet.' ] });
    testNormalization({ fixture: '15', highlights: [ 'lor si' ] });
    testNormalization({ fixture: '16', highlights: [ 'sum do' ] });
    testNormalization({ fixture: '17', highlights: [ 'Lorem ipsum.' ] });
    testNormalization({ fixture: '18', highlights: [ 'Lorem ipsum dolor sit amet consectetur' ] });
    testNormalization({ fixture: '19', highlights: [ 'ipsum dolor sit amet consectetur adipiscit elit.' ] });
    testNormalization({ fixture: '20', highlights: [ 'Lorem ipsum ', 'dolor', ' sit ', 'amet' ] });
});
