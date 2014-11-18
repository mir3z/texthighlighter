describe('Serialization', function () {
    'use strict';

    var hl;

    fixtures.loadFiles([
        'serialization.01',
        'serialization.02',
        'serialization.03',
        'serialization.04',
        'serialization.05',
        'serialization.06'
    ]);

    beforeEach(function () {
        hl = sandbox.init();
    });

    afterEach(function () {
        sandbox.empty();
    });

    function testSerialization(params) {
        it(params.title, function () {
            var htmlBefore, htmlAfter, serialized, text;

            sandbox.setFixture(params.fixturePrefix + '.' + params.fixturePostfix);
            htmlBefore = sandbox.html();
            serialized = hl.serializeHighlights();

            text = JSON.parse(serialized).map(function (hlDesc) { return hlDesc[1] });
            expect(text).toEqual(params.expectedText);

            sandbox.setFixture(params.fixturePrefix + '.base');
            hl.deserializeHighlights(serialized);
            htmlAfter = sandbox.html();

            expect(htmlBefore).toEqual(htmlAfter);
        });
    }

    testSerialization({
        title: 'Use case #01',
        fixturePrefix: '01.s11n',
        fixturePostfix: 'h1',
        expectedText: [ 'Lorem ipsum dolor sit amet', 'elit.' ]
    });

    testSerialization({
        title: 'Use case #02',
        fixturePrefix: '01.s11n',
        fixturePostfix: 'h2',
        expectedText: [ 'A', 'CC', 'Lorem ipsum dolor sit amet', 'consectetur adipiscit', 'elit.' ]
    });

    testSerialization({
        title: 'Use case #03',
        fixturePrefix: '02.s11n',
        fixturePostfix: 'h1',
        expectedText: [ 'Lorem ipsum dolor sit amet.', 'Lorem ipsum dolor sit amet.', 'Lorem ipsum dolor sit amet.' ]
    });

    testSerialization({
        title: 'Use case #04',
        fixturePrefix: '03.s11n',
        fixturePostfix: 'h1',
        expectedText: [ 'Lorem ipsum ', 'dolor sit amet ', 'consectetur adipiscing elit.' ]
    });

    testSerialization({
        title: 'Use case #05',
        fixturePrefix: '04.s11n',
        fixturePostfix: 'h1',
        expectedText: [ 'Lorem ipsum dolor sit amet consectetur adipiscing elit.', 'elit.' ]
    });
    testSerialization({
        title: 'Use case #06',
        fixturePrefix: '04.s11n',
        fixturePostfix: 'h2',
        expectedText: [ 'Lorem ipsum dolor sit amet consectetur adipiscing elit.', 'Lorem' ]
    });

    testSerialization({
        title: 'Use case #07',
        fixturePrefix: '05.s11n',
        fixturePostfix: 'h1',
        expectedText: [ 'Lorem ipsum dolor sit amet consectetur adipiscing elit.', 'sit amet' ]
    });

    testSerialization({
        title: 'Use case #08',
        fixturePrefix: '06.s11n',
        fixturePostfix: 'h1',
        expectedText: [ 'elit.', 'consectetur ', 'adipiscit ', 'sit amet ', 'ipsum dolor ' ]
    });
    testSerialization({
        title: 'Use case #09',
        fixturePrefix: '06.s11n',
        fixturePostfix: 'h2',
        expectedText: [ 'consectetur ', 'adipiscit ', 'sec', 'ipsum dolor ', 'ipsum dolor ', 'dolor ' ]
    });
});