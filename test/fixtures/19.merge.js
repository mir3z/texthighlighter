fixtures.register('19.merge', function () {
    DIV(
        'Lorem ',
        HIGHLIGHT({ color: 'red' },
            'ipsum dolor sit ',
            HIGHLIGHT({ color: 'green' }, 'amet'),
            ' consectetur adipiscit elit.'
        )
    )
});