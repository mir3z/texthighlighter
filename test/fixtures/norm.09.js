fixtures.register('09', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'green' }, 'ipsum'),
        ' dolor ',
        HIGHLIGHT({ color: 'red', marked: true }, 'sit'),
        ' amet.'
    )
});

fixtures.register('09.flat', function () {
    HIGHLIGHT({ color: 'red', marked: true },
        'Lorem ',
        HIGHLIGHT({ color: 'green' }, 'ipsum'),
        ' dolor ',
        'sit',
        ' amet.'
    )
});

fixtures.register('09.merge', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'green' }, 'ipsum'),
        ' dolor sit amet.'
    )
});