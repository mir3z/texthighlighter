fixtures.register('07.flat', function () {
    DIV(
        HIGHLIGHT({ color: 'red', marked: true }, 'Lorem ipsum '),
        HIGHLIGHT({ color: 'red', marked: true }, 'dolor'),
        HIGHLIGHT({ color: 'red', marked: true }, ' sit amet')
    )
});