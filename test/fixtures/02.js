fixtures.register('02', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ipsum dolor ',
        HIGHLIGHT({ color: 'green', marked: true }, 'sit amet'),
        ' consectetur adipiscing elit.'
    );
});