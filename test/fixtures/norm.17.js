fixtures.register('17', function () {
    HIGHLIGHT({ color: 'red'},
        HIGHLIGHT({ color: 'red', marked: true }, 'Lorem ipsum.' )
    );
});

fixtures.register('17.flat', function () {
    HIGHLIGHT({ color: 'red', marked: true }, 'Lorem ipsum.');
});

fixtures.register('17.merge', function () {
    HIGHLIGHT({ color: 'red' }, 'Lorem ipsum.');
});