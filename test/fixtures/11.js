fixtures.register('11', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ',
        HIGHLIGHT({ color: 'green' },
            'ipsum ',
            HIGHLIGHT({ color: 'red', marked: true }, 'dolor')
        ),
        HIGHLIGHT({ color: 'red', marked: true }, ' sit'),
        ' amet.'
    );
});