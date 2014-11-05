fixtures.register('15.merge', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'green' },
            'ipsum ',
            HIGHLIGHT({ color: 'blue' }, 'do'),
            HIGHLIGHT({ color: 'red' }, 'lor si'),
            'net'
        ),
        ' amet.'
    );
});