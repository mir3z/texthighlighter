describe('Normalization', function () {
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
