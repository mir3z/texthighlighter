fixtures.register('01', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ipsum dolor ',
        HIGHLIGHT({ color: 'red', marked: true }, 'sit amet'),
        ' consectetur adipiscing elit.'
    );
});