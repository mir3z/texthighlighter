fixtures.register('06', function () {
    DIV(
        'Lorem ipsum ',
        HIGHLIGHT({ color: 'green', marked: true }, 'dolor sit '),
        HIGHLIGHT({ color: 'red' },
            HIGHLIGHT({ color: 'green', marked: true }, 'amet'),
            ' consectetur adipiscing elit.'
        )
    );
});