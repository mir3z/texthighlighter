fixtures.register('22', function () {
    DIV(
        'Lorem ',
        B(
            'ipsum ',
            HIGHLIGHT({ color: 'green', marked: true }, 'dolor' )
        ),
        HIGHLIGHT({ color: 'red' },
            HIGHLIGHT({ color: 'green', marked: true }, ' sit '),
            'amet'
        )
    );
});

fixtures.register('22.flat', function () {
    DIV(
        'Lorem ',
        B(
            'ipsum ',
            HIGHLIGHT({ color: 'green', marked: true }, 'dolor' )
        ),
        HIGHLIGHT({ color: 'green', marked: true }, ' sit '),
        HIGHLIGHT({ color: 'red' }, 'amet' )
    );
});

fixtures.register('22.merge', function () {
    DIV(
        'Lorem ',
        B(
            'ipsum ',
            HIGHLIGHT({ color: 'green', marked: true }, 'dolor' )
        ),
        HIGHLIGHT({ color: 'green', marked: true }, ' sit '),
        HIGHLIGHT({ color: 'red' }, 'amet' )
    );
});