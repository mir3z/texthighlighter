fixtures.register('19', function () {
    DIV(
        'Lorem ',
        HIGHLIGHT({ color: 'red', marked: true }, 'ipsum '),
        HIGHLIGHT({ color: 'red' },
            HIGHLIGHT({ color: 'red', marked: true }, 'dolor'),
            ' sit ',
            HIGHLIGHT({ color: 'green' }, 'amet'),
            ' consectetur adipiscit elit.'
        )
    )
});