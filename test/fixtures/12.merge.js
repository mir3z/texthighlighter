fixtures.register('12.merge', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ipsum dolor',
        HIGHLIGHT({ color: 'green' }, ' sit'),
        ' amet.'
    );
});