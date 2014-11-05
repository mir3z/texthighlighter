fixtures.register('09', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'green' }, 'ipsum'),
        ' dolor ',
        HIGHLIGHT({ color: 'red', marked: true }, 'sit'),
        ' amet.'
    )
});