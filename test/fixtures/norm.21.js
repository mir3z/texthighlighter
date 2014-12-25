fixtures.register('21', function () {
    DIV(
        HIGHLIGHT({ color: 'red' },
            'Lorem ',
            HIGHLIGHT({ color: 'green', marked: true }, 'ipsum ')
        ),
        B(
            HIGHLIGHT({ color: 'green', marked: true }, 'dolor'),
            'sit'
        ),
        ' amet'
    );
});

fixtures.register('21.flat', function () {
    DIV(
        HIGHLIGHT({ color: 'red' }, 'Lorem '),
        HIGHLIGHT({ color: 'green', marked: true }, 'ipsum '),
        B(
            HIGHLIGHT({ color: 'green', marked: true }, 'dolor'),
            'sit'
        ),
        ' amet'
    );
});

fixtures.register('21.merge', function () {
    DIV(
        HIGHLIGHT({ color: 'red' }, 'Lorem '),
        HIGHLIGHT({ color: 'green', marked: true }, 'ipsum '),
        B(
            HIGHLIGHT({ color: 'green', marked: true }, 'dolor'),
            'sit'
        ),
        ' amet'
    );
});