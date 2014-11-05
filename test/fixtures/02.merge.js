fixtures.register('02.merge', function () {
    HIGHLIGHT({ color: 'red' },
        'Lorem ipsum dolor ',
        HIGHLIGHT({ color: 'green' }, 'sit amet'),
        ' consectetur adipiscing elit.'
    );
});