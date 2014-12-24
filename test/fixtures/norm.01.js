fixtures.register('01', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ipsum dolor ',
        HIGHLIGHT({ color: 'red', marked: true }, 'sit amet'),
        ' consectetur adipiscing elit.'
    );
});

fixtures.register('01.flat', function () {
    HIGHLIGHT({ color: 'red', marked: true },
        'Lorem ipsum dolor ',
        'sit amet',
        ' consectetur adipiscing elit.'
    );
});

fixtures.register('01.merge', function () {
    HIGHLIGHT({ color: 'red' }, 'Lorem ipsum dolor sit amet consectetur adipiscing elit.');
});