/* global describe, it, afterEach, beforeEach, expect, fixtures, sandbox */

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
        'norm.20',
        'norm.21',
        'norm.22'
    ]);

    beforeEach(function () {
        hl = sandbox.init();
    });

    afterEach(function () {
        sandbox.empty();
    });

    /**
     * Tests normalization of highlights.
     * Procedure:
     * [1] Load fixture.
     * [2] Normalize highlights.
     * [3] Check highlights returned by normalization method.
     * @param params
     * @param {string} params.title - test title
     * @param {string} params.fixture - name of the fixture to load
     * @param {string[]} params.highlights - expected text content of highlights returned by normalization
     */
    function testNormalization(params) {
        it(params.title, function () {
            var normalized = hl.normalizeHighlights(sandbox.setFixture(params.fixture));

            expect(
                normalized.map(function (h) { return h.textContent; })
            ).toEqual(params.highlights);
        });
    }

    testNormalization({ 
        title: 'use case #01', 
        fixture: '01', 
        highlights: [ 'Lorem ipsum dolor sit amet consectetur adipiscing elit.' ] 
    });
    
    testNormalization({ 
        title: 'use case #02', 
        fixture: '02', 
        highlights: [ 'sit amet' ] 
    });
    
    testNormalization({ 
        title: 'use case #03', 
        fixture: '03', 
        highlights: [ 'Lorem ipsum dolor sit amet consectetur adipiscing elit.' ] 
    });
    
    testNormalization({ 
        title: 'use case #04', 
        fixture: '04', 
        highlights: [ 'Lorem ipsum dolor sit amet consectetur adipiscing elit.' ] 
    });
    
    testNormalization({ 
        title: 'use case #05', 
        fixture: '05', 
        highlights: [ 'dolor sit amet' ] 
    });
    
    testNormalization({ 
        title: 'use case #06', 
        fixture: '06', 
        highlights: [ 'dolor sit amet' ] 
    });
    
    testNormalization({ 
        title: 'use case #07', 
        fixture: '07', 
        highlights: [ 'Lorem ipsum dolor sit amet' ] 
    });
    
    testNormalization({ 
        title: 'use case #08', 
        fixture: '08', 
        highlights: [ 'ipsum dolor sit' ] 
    });
    
    testNormalization({ 
        title: 'use case #09', 
        fixture: '09', 
        highlights: [ 'Lorem ipsum dolor sit amet.' ] 
    });
    
    testNormalization({ 
        title: 'use case #10', 
        fixture: '10', 
        highlights: [ 'Lorem ipsum dolor sit amet.' ] 
    });
    
    testNormalization({ 
		title: 'use case #11', 
		fixture: '11', 
		highlights: [ 'Lorem ipsum dolor sit amet.' ]
    });

    testNormalization({ 
		title: 'use case #12', 
		fixture: '12', 
		highlights: [ 'Lorem ipsum dolor sit amet.' ]
    });

    testNormalization({ 
		title: 'use case #13', 
		fixture: '13', 
		highlights: [ 'Lorem ipsum dolor sit amet.' ]
    });

    testNormalization({ 
		title: 'use case #14', 
		fixture: '14', 
		highlights: [ 'Lorem ipsum dolor sit amet.' ]
    });

    testNormalization({ 
		title: 'use case #15', 
		fixture: '15', 
		highlights: [ 'lor si' ]
    });

    testNormalization({ 
		title: 'use case #16', 
		fixture: '16', 
		highlights: [ 'sum do' ]
    });

    testNormalization({ 
		title: 'use case #17', 
		fixture: '17', 
		highlights: [ 'Lorem ipsum.' ]
    });

    testNormalization({ 
		title: 'use case #18', 
		fixture: '18', 
		highlights: [ 'Lorem ipsum dolor sit amet consectetur' ]
    });

    testNormalization({ 
		title: 'use case #19', 
		fixture: '19', 
		highlights: [ 'ipsum dolor sit amet consectetur adipiscit elit.' ]
    });

    testNormalization({ 
		title: 'use case #20', 
		fixture: '20', 
		highlights: [ 'Lorem ipsum ', 'dolor', ' sit ', 'amet' ]
    });

    testNormalization({
        title: 'use case #21',
        fixture: '21',
        highlights: [ 'ipsum ', 'dolor' ]
    });

    testNormalization({
        title: 'use case #22',
        fixture: '22',
        highlights: [ 'dolor', ' sit ' ]
    });

});
