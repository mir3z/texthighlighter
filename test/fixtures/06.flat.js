fixtures.register('06.flat', function () {
    DIV(
        'Lorem ipsum ',
        HIGHLIGHT({ color: 'green', marked: true }, 'dolor sit '),
        HIGHLIGHT({ color: 'green', marked: true }, 'amet'),
        HIGHLIGHT({ color: 'red' }, ' consectetur adipiscing elit.')
    );
});