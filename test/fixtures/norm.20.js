fixtures.register('20', function () {
    DIV(
        HIGHLIGHT({ color: 'red' }, 'Lorem '),
        HIGHLIGHT({ color: 'red', marked: true }, 'ipsum '),
        B(
            HIGHLIGHT({ color: 'red', marked: true }, 'dolor')
        ),
        HIGHLIGHT({ color: 'red', marked: true }, ' sit '),
        B(
            HIGHLIGHT({ color: 'red', marked: true }, 'amet'),
            ' consectetur'
        ),
        ' adipiscing elit.'
    )
});

fixtures.register('20.flat', function () {
    DIV(
        HIGHLIGHT({ color: 'red' }, 'Lorem '),
        HIGHLIGHT({ color: 'red', marked: true }, 'ipsum '),
        B(
            HIGHLIGHT({ color: 'red', marked: true }, 'dolor')
        ),
        HIGHLIGHT({ color: 'red', marked: true }, ' sit '),
        B(
            HIGHLIGHT({ color: 'red', marked: true }, 'amet'),
            ' consectetur'
        ),
        ' adipiscing elit.'
    )
});

fixtures.register('20.merge', function () {
    DIV(
        HIGHLIGHT({ color: 'red' }, 'Lorem ipsum '),
        B(
            HIGHLIGHT({ color: 'red' }, 'dolor')
        ),
        HIGHLIGHT({ color: 'red' }, ' sit '),
        B(
            HIGHLIGHT({ color: 'red' }, 'amet'),
            ' consectetur'
        ),
        ' adipiscing elit.'
    )
});