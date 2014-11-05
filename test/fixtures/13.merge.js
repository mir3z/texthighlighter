fixtures.register('13.merge', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'green' },
            'ipsum ',
            HIGHLIGHT({ color: 'blue' }, 'do')
        ),
        'lor sit amet.'
    );
});