fixtures.register('12', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'red', marked: true }, 'ipsum '),
        HIGHLIGHT({ color: 'green' },
            HIGHLIGHT({ color: 'red', marked: true }, 'dolor'),
            ' sit'
        ),
        ' amet.'
    );
});

fixtures.register('12.flat', function () {
    HIGHLIGHT({ color: 'red', marked: true },
        'Lorem ',
        'ipsum ',
        'dolor',
        HIGHLIGHT({ color: 'green' }, ' sit'),
        ' amet.'
    );
});

fixtures.register('12.merge', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ipsum dolor',
        HIGHLIGHT({ color: 'green' }, ' sit'),
        ' amet.'
    );
});