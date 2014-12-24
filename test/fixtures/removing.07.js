fixtures.register('07.preremove', function () {
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

fixtures.register('07.postremove.all', function () {
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