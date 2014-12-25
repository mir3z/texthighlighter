fixtures.register('02.s11n.base', function () {
    DIV('Lorem ipsum dolor sit amet.');
});

fixtures.register('02.s11n.h1', function () {
    DIV(
        HIGHLIGHT({ color: 'red'  },
            HIGHLIGHT({ color: 'green' },
                HIGHLIGHT({ color: 'blue' }, 'Lorem ipsum dolor sit amet.')
            )
        )
    );
});