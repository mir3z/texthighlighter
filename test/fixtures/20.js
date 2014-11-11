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