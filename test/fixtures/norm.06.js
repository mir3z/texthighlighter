fixtures.register('06', function () {
    DIV(
        'Lorem ipsum ',
        HIGHLIGHT({ color: 'green', marked: true }, 'dolor sit '),
        HIGHLIGHT({ color: 'red' },
            HIGHLIGHT({ color: 'green', marked: true }, 'amet'),
            ' consectetur adipiscing elit.'
        )
    );
});

fixtures.register('06.flat', function () {
    DIV(
        'Lorem ipsum ',
        HIGHLIGHT({ color: 'green', marked: true }, 'dolor sit '),
        HIGHLIGHT({ color: 'green', marked: true }, 'amet'),
        HIGHLIGHT({ color: 'red' }, ' consectetur adipiscing elit.')
    );
});

fixtures.register('06.merge', function () {
    DIV(
        'Lorem ipsum ',
        HIGHLIGHT({ color: 'green' }, 'dolor sit amet'),
        HIGHLIGHT({ color: 'red' }, ' consectetur adipiscing elit.')
    );
});