fixtures.register('01.s11n.base', function () {
    SPAN(
        'AAA',
        SPAN(
            'CCC',
            SPAN('Lorem ipsum dolor sit amet'),
            SPAN('consectetur adipiscit'),
            SPAN('elit.')
        ),
        SPAN('DDD'),
        'BBB'
    )
});

fixtures.register('01.s11n.h1', function () {
    SPAN(
        'AAA',
        SPAN(
            'CCC',
            SPAN(
                HIGHLIGHT({ color: 'red' }, 'Lorem ipsum dolor sit amet')
            ),
            SPAN('consectetur adipiscit'),
            SPAN(
                HIGHLIGHT({ color: 'green' }, 'elit.')
            )
        ),
        SPAN('DDD'),
        'BBB'
    )
});

fixtures.register('01.s11n.h2', function () {
    SPAN(
        'AA',
        HIGHLIGHT({ color: 'blue' }, 'A'),
        SPAN(
            HIGHLIGHT({ color: 'blue' }, 'CC'),
            'C',
            SPAN(
                HIGHLIGHT({ color: 'red' }, 'Lorem ipsum dolor sit amet')
            ),
            SPAN(
                HIGHLIGHT({ color: 'green' }, 'consectetur adipiscit')
            ),
            SPAN(
                HIGHLIGHT({ color: 'blue' }, 'elit.')
            )
        ),
        SPAN('DDD'),
        'BBB'
    )
});