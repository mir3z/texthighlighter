fixtures.register('16', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'green' },
            'ip',
            HIGHLIGHT({ color: 'red', marked: true }, 'sum '),
            HIGHLIGHT({ color: 'blue' },
                HIGHLIGHT({ color: 'red', marked: true }, 'do'),
                'lor'
            ),
            ' sit'
        ),
        ' amet.'
    );
});

fixtures.register('16.flat', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'green' },
            'ip',
            HIGHLIGHT({ color: 'red', marked: true }, 'sum '),
            HIGHLIGHT({ color: 'red', marked: true }, 'do'),
            HIGHLIGHT({ color: 'blue' }, 'lor'),
            ' sit'
        ),
        ' amet.'
    );
});

fixtures.register('16.merge', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'green' },
            'ip',
            HIGHLIGHT({ color: 'red' }, 'sum do'),
            HIGHLIGHT({ color: 'blue' }, 'lor'),
            ' sit'
        ),
        ' amet.'
    );
});