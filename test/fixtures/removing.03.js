fixtures.register('03.preremove', function () {
    DIV(
        HIGHLIGHT({ color: 'red', marked: 'h1' },
            HIGHLIGHT({ color: 'green', marked: 'h2' }, 'Lorem'),
            ' ipsum dolor sit amet consectetur adipiscing elit.'
        )
    );
});

fixtures.register('03.postremove.all', function () {
    DIV('Lorem ipsum dolor sit amet consectetur adipiscing elit.');
});

fixtures.register('03.postremove.h2', function () {
    DIV(
        HIGHLIGHT({ color: 'red' }, 'Lorem ipsum dolor sit amet consectetur adipiscing elit.')
    );
});