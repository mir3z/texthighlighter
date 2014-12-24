fixtures.register('lorem.02', function () {
    DIV({ marked: 'node' },
        'Lorem ipsum dolor ',
        B({ marked: 'node' }, 'sit amet'),
        ' consectetur adipiscing elit.'
    )
});