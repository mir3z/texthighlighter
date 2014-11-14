fixtures.register('13', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'green' },
            'ipsum ',
            HIGHLIGHT({ color: 'blue' },
                'do',
                HIGHLIGHT({ color: 'red', marked: true }, 'lor')
            ),
            HIGHLIGHT({ color: 'red', marked: true }, ' sit')
        ),
        HIGHLIGHT({ color: 'red', marked: true }, ' am' ),
        'et.'
    );
});

fixtures.register('13.flat', function () {
    HIGHLIGHT({ color: 'red', marked: true },
        'Lorem ',
        HIGHLIGHT({ color: 'green' },
            'ipsum ',
            HIGHLIGHT({ color: 'blue' }, 'do')
        ),
        'lor',
        ' sit',
        ' am',
        'et.'
    );
});

fixtures.register('13.merge', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'green' },
            'ipsum ',
            HIGHLIGHT({ color: 'blue' }, 'do')
        ),
        'lor sit amet.'
    );
});