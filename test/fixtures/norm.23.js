fixtures.register('23', function () {
    DIV(
        HIGHLIGHT({ color: 'red' },
            HIGHLIGHT({ color: 'green', marked: true }, 'Lorem ipsum')
        )
    );
});

fixtures.register('23.flat', function () {
    DIV(
        HIGHLIGHT({ color: 'green', marked: true }, 'Lorem ipsum')
    );
});

fixtures.register('22.merge', function () {
    DIV(
        HIGHLIGHT({ color: 'green', marked: true }, 'Lorem ipsum')
    );
});