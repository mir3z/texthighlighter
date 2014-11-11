fixtures.register('18', function () {
    DIV(
        HIGHLIGHT({ color: 'red' },
            'Lorem ipsum ',
            HIGHLIGHT({ color: 'green' }, 'dolor'),
            ' sit ',
            HIGHLIGHT({ color: 'red', marked: true }, 'amet ')
        ),
        HIGHLIGHT({ color: 'red', marked: true }, 'consectetur'),
        ' adipictit elit.'
    )
});