fixtures.register('03.s11n.base', function () {
    DIV('Lorem ipsum dolor sit amet consectetur adipiscing elit.');
});

fixtures.register('03.s11n.h1', function () {
    DIV(
        HIGHLIGHT({ color: 'red' }, 'Lorem ipsum '),
        HIGHLIGHT({ color: 'green' }, 'dolor sit amet '),
        HIGHLIGHT({ color: 'blue' }, 'consectetur adipiscing elit.')
    );
});