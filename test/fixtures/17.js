fixtures.register('17', function () {
    HIGHLIGHT({ color: 'red'},
        HIGHLIGHT({ color: 'red', marked: true }, 'Lorem ipsum.' )
    );
});