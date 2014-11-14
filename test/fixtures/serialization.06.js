fixtures.register('06.s11n.base', function () {
    DIV(
        'Lorem ',
        DIV(
            DIV(
                DIV('ipsum dolor ')
            ),
            DIV('sit amet '),
            'consectetur adipiscit '
        ),
        'elit.'
    );
});

fixtures.register('06.s11n.h1', function () {
    DIV(
        'Lorem ',
        DIV(
            DIV(
                DIV(
                    HIGHLIGHT({ color: 'red' }, 'ipsum dolor ')
                )
            ),
            DIV(
                HIGHLIGHT({ color: 'red' }, 'sit amet ')
            ),
            HIGHLIGHT({ color: 'red' }, 'consectetur '),
            HIGHLIGHT({ color: 'green' }, 'adipiscit ')
        ),
        HIGHLIGHT({ color: 'blue' }, 'elit.')
    );
});

fixtures.register('06.s11n.h2', function () {
    DIV(
        'Lorem ',
        DIV(
            DIV(
                DIV(
                    HIGHLIGHT({ color: 'red' },
                        HIGHLIGHT({ color: 'green' },
                            'ipsum ',
                            HIGHLIGHT({ color: 'blue' }, 'dolor ')
                        )
                    )
                )
            ),
            DIV('sit amet '),
            HIGHLIGHT({ color: 'red' },
                'con',
                HIGHLIGHT({ color: 'blue' }, 'sec'),
                'tetur '
            ),
            HIGHLIGHT({ color: 'green' }, 'adipiscit ')
        ),
        'elit.'
    );
});