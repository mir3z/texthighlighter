fixtures.register('10', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'red', marked: true }, 'ipsum'),
        ' dolor ',
        HIGHLIGHT({ color: 'green' }, 'sit'),
        ' amet.'
    )
});