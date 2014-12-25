fixtures.register('05', function () {
    DIV(
        HIGHLIGHT({ color: 'red' },
            'Lorem ipsum ',
            HIGHLIGHT({ color: 'green', marked: true }, 'dolor')
        ),
        HIGHLIGHT({ color: 'green', marked: true }, ' sit amet'),
        ' consectetur adipiscing elit.'
    );
});

fixtures.register('05.flat', function () {
    DIV(
        HIGHLIGHT({ color: 'red' }, 'Lorem ipsum '),
        HIGHLIGHT({ color: 'green', marked: true }, 'dolor'),
        HIGHLIGHT({ color: 'green', marked: true }, ' sit amet'),
        ' consectetur adipiscing elit.'
    );
});

fixtures.register('05.merge', function () {
    DIV(
        HIGHLIGHT({ color: 'red' }, 'Lorem ipsum '),
        HIGHLIGHT({ color: 'green' }, 'dolor sit amet'),
        ' consectetur adipiscing elit.'
    );
});