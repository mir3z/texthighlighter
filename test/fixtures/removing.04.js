fixtures.register('04.preremove', function () {
    DIV(
        HIGHLIGHT({ color: 'red', marked: 'h1' },
            'Lorem ipsum dolor sit amet consectetur adipiscing ',
            HIGHLIGHT({ color: 'green', marked: 'h2' }, 'elit.')
        )
    );
});

fixtures.register('04.postremove.all', function () {
    DIV('Lorem ipsum dolor sit amet consectetur adipiscing elit.');
});

fixtures.register('04.postremove.h2', function () {
    DIV(
        HIGHLIGHT({ color: 'red' }, 'Lorem ipsum dolor sit amet consectetur adipiscing elit.')
    );
});