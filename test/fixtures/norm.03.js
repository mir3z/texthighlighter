fixtures.register('03', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ipsum dolor sit amet consectetur adipiscing ',
        HIGHLIGHT({ color: 'red', marked: true }, 'elit.')
    );
});

fixtures.register('03.flat', function () {
    HIGHLIGHT({ color: 'red', marked: true },
        'Lorem ipsum dolor sit amet consectetur adipiscing ',
        'elit.'
    );
});

fixtures.register('03.merge', function () {
    HIGHLIGHT({ color: 'red' }, 'Lorem ipsum dolor sit amet consectetur adipiscing elit.');
});