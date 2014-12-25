fixtures.register('05.preremove', function () {
    DIV(
        HIGHLIGHT({ color: 'red', marked: 'h1' },
            HIGHLIGHT({ color: 'green', marked: 'h2' },
                HIGHLIGHT({ color: 'blue', marked: 'h3' }, 'Lorem ipsum dolor sit amet.')
            )
        )
    );
});

fixtures.register('05.postremove.all', function () {
    DIV('Lorem ipsum dolor sit amet.');
});

fixtures.register('05.postremove.h1', function () {
    DIV('Lorem ipsum dolor sit amet.');
});

fixtures.register('05.postremove.h2', function () {
    DIV(
        HIGHLIGHT({ color: 'red', marked: 'h1' }, 'Lorem ipsum dolor sit amet.')
    );
});

fixtures.register('05.postremove.h3', function () {
    DIV(
        HIGHLIGHT({ color: 'red', marked: 'h1' },
            HIGHLIGHT({ color: 'green', marked: 'h2' }, 'Lorem ipsum dolor sit amet.')
        )
    );
});