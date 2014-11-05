fixtures.register('07', function () {
    DIV(
        HIGHLIGHT({ color: 'red', marked: true }, 'Lorem ipsum '),
        HIGHLIGHT({ color: 'green' },
            HIGHLIGHT({ color: 'red', marked: true }, 'dolor')
        ),
        HIGHLIGHT({ color: 'red', marked: true }, ' sit amet')
    )
});