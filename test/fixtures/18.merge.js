fixtures.register('18.merge', function () {
    DIV(
        HIGHLIGHT({ color: 'red' },
            'Lorem ipsum ',
            HIGHLIGHT({ color: 'green' }, 'dolor'),
            ' sit amet consectetur'
        ),
        ' adipictit elit.'
    )
});