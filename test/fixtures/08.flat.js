fixtures.register('08.flat', function () {
    DIV(
        HIGHLIGHT({ color: 'green' }, 'Lorem '),
        HIGHLIGHT({ color: 'red', marked: true }, 'ipsum'),
        HIGHLIGHT({ color: 'red', marked: true }, ' dolor '),
        HIGHLIGHT({ color: 'red', marked: true }, 'sit'),
        HIGHLIGHT({ color: 'green' }, ' amet.')
    )
});