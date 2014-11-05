fixtures.register('09.merge', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'green' }, 'ipsum'),
        ' dolor sit amet.'
    )
});