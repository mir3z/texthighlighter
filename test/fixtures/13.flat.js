fixtures.register('13.flat', function () {
    HIGHLIGHT({ color: 'red', marked: true },
        'Lorem ',
        HIGHLIGHT({ color: 'green' },
            'ipsum ',
            HIGHLIGHT({ color: 'blue' }, 'do')
        ),
        'lor',
        ' sit',
        ' am',
        'et.'
    );
});