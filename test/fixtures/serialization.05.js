fixtures.register('05.s11n.base', function () {
    DIV('Lorem ipsum dolor sit amet consectetur adipiscing elit.');
});

fixtures.register('05.s11n.h1', function () {
    DIV(
        HIGHLIGHT({ color: 'red' },
            'Lorem ipsum dolor ',
            HIGHLIGHT({ color: 'green' }, 'sit amet'),
            ' consectetur adipiscing elit.'
        )
    );
});