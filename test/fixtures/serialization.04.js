fixtures.register('04.s11n.base', function () {
    DIV('Lorem ipsum dolor sit amet consectetur adipiscing elit.');
});

fixtures.register('04.s11n.h1', function () {
    DIV(
        HIGHLIGHT({ color: 'red' },
            'Lorem ipsum dolor sit amet consectetur adipiscing ',
            HIGHLIGHT({ color: 'green' }, 'elit.')
        )
    );
});

fixtures.register('04.s11n.h2', function () {
    DIV(
        HIGHLIGHT({ color: 'red' },
            HIGHLIGHT({ color: 'green' }, 'Lorem'),
            ' ipsum dolor sit amet consectetur adipiscing elit.'
        )
    );
});

