fixtures.register('03', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ipsum dolor sit amet consectetur adipiscing ',
        HIGHLIGHT({ color: 'red', marked: true }, 'elit.')
    );
});