fixtures.register('14.merge', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ipsum do',
        HIGHLIGHT({ color: 'green' },
            HIGHLIGHT({ color: 'blue' }, 'lor' ),
            ' sit'
        ),
        ' amet.'
    );
});