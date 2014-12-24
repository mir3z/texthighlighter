fixtures.register('18', function () {
    DIV(
        HIGHLIGHT({ color: 'red' },
            'Lorem ipsum ',
            HIGHLIGHT({ color: 'green' }, 'dolor'),
            ' sit ',
            HIGHLIGHT({ color: 'red', marked: true }, 'amet ')
        ),
        HIGHLIGHT({ color: 'red', marked: true }, 'consectetur'),
        ' adipictit elit.'
    )
});

fixtures.register('18.flat', function () {
    DIV(
        HIGHLIGHT({ color: 'red', marked: true },
            'Lorem ipsum ',
            HIGHLIGHT({ color: 'green' }, 'dolor'),
            ' sit ',
            'amet '
        ),
        HIGHLIGHT({ color: 'red', marked: true }, 'consectetur'),
        ' adipictit elit.'
    )
});

fixtures.register('18.merge', function () {
    DIV(
        HIGHLIGHT({ color: 'red' },
            'Lorem ipsum ',
            HIGHLIGHT({ color: 'green' }, 'dolor'),
            ' sit amet consectetur'
        ),
        ' adipictit elit.'
    )
});