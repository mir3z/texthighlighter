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

fixtures.register('11.flat', function () {
    HIGHLIGHT({ color: 'red', marked: true },
        'Lorem ',
        HIGHLIGHT({ color: 'green' }, 'ipsum '),
        'dolor',
        ' sit',
        ' amet.'
    );
});

fixtures.register('11.merge', function () {
    HIGHLIGHT({ color: 'red'  },
        'Lorem ',
        HIGHLIGHT({ color: 'green' }, 'ipsum '),
        'dolor sit amet.'
    );
});