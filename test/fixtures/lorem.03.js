fixtures.register('lorem.03', function () {
    DIV({ marked: 'node' },
        'Lorem ipsum ',
        B({ marked: 'node' }, 'dolor'),
        ' sit amet ',
        B({ marked: 'node' }, 'consectetur'),
        ' adipiscing elit.'
    )
});