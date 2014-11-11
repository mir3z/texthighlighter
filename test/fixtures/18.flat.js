fixtures.register('18.flat', function () {
    DIV(
        HIGHLIGHT({ color: 'red', marked: true },
            'Lorem ipsum ',
            HIGHLIGHT({ color: 'green' }, 'dolor'),
            ' sit ',
            'amet '
        ),
        HIGHLIGHT({ color: 'red', marked: true }, 'consectetur'),
        ' adipictit elit.'
    )
});