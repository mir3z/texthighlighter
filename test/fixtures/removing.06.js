fixtures.register('06.preremove', function () {
    DIV(
        HIGHLIGHT({ color: 'red' }, 'Lorem ipsum '),
        HIGHLIGHT({ color: 'green' }, 'dolor sit amet '),
        HIGHLIGHT({ color: 'blue' }, 'consectetur adipiscing elit.')
    );
});

fixtures.register('06.postremove.all', function () {
    DIV('Lorem ipsum dolor sit amet consectetur adipiscing elit.');
});