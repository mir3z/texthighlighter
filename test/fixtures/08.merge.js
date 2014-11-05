fixtures.register('08.merge', function () {
    DIV(
        HIGHLIGHT({ color: 'green' }, 'Lorem '),
        HIGHLIGHT({ color: 'red' }, 'ipsum dolor sit'),
        HIGHLIGHT({ color: 'green' }, ' amet.')
    )
});