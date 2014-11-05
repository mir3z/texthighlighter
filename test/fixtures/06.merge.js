fixtures.register('06.merge', function () {
    DIV(
        'Lorem ipsum ',
        HIGHLIGHT({ color: 'green' }, 'dolor sit amet'),
        HIGHLIGHT({ color: 'red' }, ' consectetur adipiscing elit.')
    );
});