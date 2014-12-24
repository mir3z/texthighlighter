fixtures.register('01.preremove', function () {
    DIV(
        HIGHLIGHT({ color: 'red' }, 'Lorem ipsum dolor sit amet consectetur adipiscing elit.')
    );
});

fixtures.register('01.postremove.all', function () {
    DIV('Lorem ipsum dolor sit amet consectetur adipiscing elit.');
});