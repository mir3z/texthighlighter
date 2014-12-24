fixtures.register('04', function () {
    HIGHLIGHT({ color: 'red' },
        HIGHLIGHT({ color: 'red', marked: true }, 'Lorem'),
        ' ipsum dolor sit amet consectetur adipiscing elit.'
    );
});

fixtures.register('04.flat', function () {
    HIGHLIGHT({ color: 'red', marked: true },
        'Lorem',
        ' ipsum dolor sit amet consectetur adipiscing elit.'
    );
});

fixtures.register('04.merge', function () {
    HIGHLIGHT({ color: 'red' }, 'Lorem ipsum dolor sit amet consectetur adipiscing elit.');
});