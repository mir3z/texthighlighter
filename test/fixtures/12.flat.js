fixtures.register('12.flat', function () {
    HIGHLIGHT({ color: 'red', marked: true },
        'Lorem ',
        'ipsum ',
        'dolor',
        HIGHLIGHT({ color: 'green' }, ' sit'),
        ' amet.'
    );
});