fixtures.register('19.flat', function () {
    DIV(
        'Lorem ',
        HIGHLIGHT({ color: 'red', marked: true }, 'ipsum '),
        HIGHLIGHT({ color: 'red' },
            'dolor',
            ' sit ',
            HIGHLIGHT({ color: 'green' }, 'amet'),
            ' consectetur adipiscit elit.'
        )
    )
});