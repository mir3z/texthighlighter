fixtures.register('10.merge', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ipsum dolor ',
        HIGHLIGHT({ color: 'green' }, 'sit'),
        ' amet.'
    )
});