fixtures.register('14', function () {
    HIGHLIGHT({ color: 'red' },
        'Lo',
        HIGHLIGHT({ color: 'red', marked: true }, 'rem ' ),
        HIGHLIGHT({ color: 'green' },
            HIGHLIGHT({ color: 'red', marked: true }, 'ipsum '),
            HIGHLIGHT({ color: 'blue' },
                HIGHLIGHT({ color: 'red', marked: true }, 'do'),
                'lor'
            ),
            ' sit'
        ),
        ' amet.'
    );
});