fixtures.register('15', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'green' },
            'ipsum ',
            HIGHLIGHT({ color: 'blue' },
                'do',
                HIGHLIGHT({ color: 'red', marked: true }, 'lor')
            ),
            HIGHLIGHT({ color: 'red', marked: true }, ' si'),
            'net'
        ),
        ' amet.'
    );
});