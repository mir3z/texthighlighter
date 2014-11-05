fixtures.register('09.flat', function () {
    HIGHLIGHT({ color: 'red', marked: true },
        'Lorem ',
        HIGHLIGHT({ color: 'green' }, 'ipsum'),
        ' dolor ',
        'sit',
        ' amet.'
    )
});