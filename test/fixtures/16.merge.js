fixtures.register('16.merge', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'green' },
            'ip',
            HIGHLIGHT({ color: 'red' }, 'sum do'),
            HIGHLIGHT({ color: 'blue' }, 'lor'),
            ' sit'
        ),
        ' amet.'
    );
});