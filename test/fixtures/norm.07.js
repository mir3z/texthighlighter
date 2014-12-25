fixtures.register('07', function () {
    DIV(
        HIGHLIGHT({ color: 'red', marked: true }, 'Lorem ipsum '),
        HIGHLIGHT({ color: 'green' },
            HIGHLIGHT({ color: 'red', marked: true }, 'dolor')
        ),
        HIGHLIGHT({ color: 'red', marked: true }, ' sit amet')
    )
});

fixtures.register('07.flat', function () {
    DIV(
        HIGHLIGHT({ color: 'red', marked: true }, 'Lorem ipsum '),
        HIGHLIGHT({ color: 'red', marked: true }, 'dolor'),
        HIGHLIGHT({ color: 'red', marked: true }, ' sit amet')
    )
});

fixtures.register('07.merge', function () {
    DIV(
        HIGHLIGHT({ color: 'red' }, 'Lorem ipsum dolor sit amet')
    )
});