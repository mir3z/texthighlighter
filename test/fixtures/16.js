fixtures.register('16', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'green' },
            'ip',
            HIGHLIGHT({ color: 'red', marked: true }, 'sum '),
            HIGHLIGHT({ color: 'blue' },
                HIGHLIGHT({ color: 'red', marked: true }, 'do'),
                'lor'
            ),
            ' sit'
        ),
        ' amet.'
    );
});