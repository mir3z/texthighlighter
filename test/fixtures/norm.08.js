fixtures.register('08', function () {
   DIV(
       HIGHLIGHT({ color: 'green' },
           'Lorem ',
           HIGHLIGHT({ color: 'red', marked: true }, 'ipsum')
       ),
       HIGHLIGHT({ color: 'red', marked: true }, ' dolor '),
       HIGHLIGHT({ color: 'green' },
           HIGHLIGHT({ color: 'red', marked: true }, 'sit'),
           ' amet.'
       )
   )
});

fixtures.register('08.flat', function () {
    DIV(
        HIGHLIGHT({ color: 'green' }, 'Lorem '),
        HIGHLIGHT({ color: 'red', marked: true }, 'ipsum'),
        HIGHLIGHT({ color: 'red', marked: true }, ' dolor '),
        HIGHLIGHT({ color: 'red', marked: true }, 'sit'),
        HIGHLIGHT({ color: 'green' }, ' amet.')
    )
});

fixtures.register('08.merge', function () {
    DIV(
        HIGHLIGHT({ color: 'green' }, 'Lorem '),
        HIGHLIGHT({ color: 'red' }, 'ipsum dolor sit'),
        HIGHLIGHT({ color: 'green' }, ' amet.')
    )
});