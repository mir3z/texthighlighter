fixtures.register('14.flat', function () {
    HIGHLIGHT({ color: 'red', marked: true },
        'Lo',
        'rem ',
        'ipsum ',
        'do',
        HIGHLIGHT({ color: 'green' },
            HIGHLIGHT({ color: 'blue' }, 'lor' ),
            ' sit'
        ),
        ' amet.'
    );
});