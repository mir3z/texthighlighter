fixtures.register('04', function () {
    HIGHLIGHT({ color: 'red' },
        HIGHLIGHT({ color: 'red', marked: true }, 'Lorem'),
        ' ipsum dolor sit amet consectetur adipiscing elit.'
    );
});