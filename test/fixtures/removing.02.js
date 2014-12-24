fixtures.register('02.preremove', function () {
    DIV(
        HIGHLIGHT({ color: 'red', marked: 'h1' },
            'Lorem ipsum dolor ',
            HIGHLIGHT({ color: 'green', marked: 'h2' }, 'sit amet'),
            ' consectetur adipiscing elit.'
        )
    );
});

fixtures.register('02.postremove.all', function () {
    DIV('Lorem ipsum dolor sit amet consectetur adipiscing elit.');
});

fixtures.register('02.postremove.h2', function () {
    DIV(
        HIGHLIGHT({ color: 'red' }, 'Lorem ipsum dolor sit amet consectetur adipiscing elit.')
    );
});