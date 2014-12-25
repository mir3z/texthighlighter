fixtures.register('02', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ipsum dolor ',
        HIGHLIGHT({ color: 'green', marked: true }, 'sit amet'),
        ' consectetur adipiscing elit.'
    );
});

fixtures.register('02.flat', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ipsum dolor ',
        HIGHLIGHT({ color: 'green', marked: true }, 'sit amet'),
        ' consectetur adipiscing elit.'
    );
});

fixtures.register('02.merge', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ipsum dolor ',
        HIGHLIGHT({ color: 'green' }, 'sit amet'),
        ' consectetur adipiscing elit.'
    );
});