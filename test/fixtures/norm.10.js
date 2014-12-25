fixtures.register('10', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'red', marked: true }, 'ipsum'),
        ' dolor ',
        HIGHLIGHT({ color: 'green' }, 'sit'),
        ' amet.'
    )
});

fixtures.register('10.flat', function () {
    HIGHLIGHT({ color: 'red', marked: true },
        'Lorem ',
        'ipsum',
        ' dolor ',
        HIGHLIGHT({ color: 'green' }, 'sit'),
        ' amet.'
    )
});

fixtures.register('10.merge', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ipsum dolor ',
        HIGHLIGHT({ color: 'green' }, 'sit'),
        ' amet.'
    )
});