fixtures.register('11.flat', function () {
    HIGHLIGHT({ color: 'red', marked: true },
        'Lorem ',
        HIGHLIGHT({ color: 'green' }, 'ipsum '),
        'dolor',
        ' sit',
        ' amet.'
    );
});