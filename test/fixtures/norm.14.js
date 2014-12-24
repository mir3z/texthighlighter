fixtures.register('14', function () {
    HIGHLIGHT({ color: 'red' },
        'Lo',
        HIGHLIGHT({ color: 'red', marked: true }, 'rem ' ),
        HIGHLIGHT({ color: 'green' },
            HIGHLIGHT({ color: 'red', marked: true }, 'ipsum '),
            HIGHLIGHT({ color: 'blue' },
                HIGHLIGHT({ color: 'red', marked: true }, 'do'),
                'lor'
            ),
            ' sit'
        ),
        ' amet.'
    );
});

fixtures.register('14.flat', function () {
    HIGHLIGHT({ color: 'red', marked: true },
        'Lo',
        'rem ',
        'ipsum ',
        'do',
        HIGHLIGHT({ color: 'green' },
            HIGHLIGHT({ color: 'blue' }, 'lor' ),
            ' sit'
        ),
        ' amet.'
    );
});

fixtures.register('14.merge', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ipsum do',
        HIGHLIGHT({ color: 'green' },
            HIGHLIGHT({ color: 'blue' }, 'lor' ),
            ' sit'
        ),
        ' amet.'
    );
});