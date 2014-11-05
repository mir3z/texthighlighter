fixtures.register('12', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'red', marked: true }, 'ipsum '),
        HIGHLIGHT({ color: 'green' },
            HIGHLIGHT({ color: 'red', marked: true }, 'dolor'),
            ' sit'
        ),
        ' amet.'
    );
});