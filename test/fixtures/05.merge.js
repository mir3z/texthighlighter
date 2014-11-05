fixtures.register('05.merge', function () {
    DIV(
        HIGHLIGHT({ color: 'red' }, 'Lorem ipsum '),
        HIGHLIGHT({ color: 'green' }, 'dolor sit amet'),
        ' consectetur adipiscing elit.'
    );
});