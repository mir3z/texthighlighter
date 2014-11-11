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