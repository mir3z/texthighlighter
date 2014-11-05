fixtures.register('16.flat', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'green' },
            'ip',
            HIGHLIGHT({ color: 'red', marked: true }, 'sum '),
            HIGHLIGHT({ color: 'red', marked: true }, 'do'),
            HIGHLIGHT({ color: 'blue' }, 'lor'),
            ' sit'
        ),
        ' amet.'
    );
});