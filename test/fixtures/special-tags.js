fixtures.register('special-tags', function () {
    DIV({ marked: 'node' },
        'A',
        SELECT(
            OPTION('option 1'),
            OPTION('option 2'),
            OPTION('option 3')
        ),
        'B',
        IMG({ src: '', alt: 'image'}),
        'C',
        VIDEO(
            SOURCE({ type: 'video/mp4' }),
            'Not supported'
        ),
        'D',
        STYLE('#sandbox { }'),
        'E',
        BUTTON('OK'),
        'F',
        OBJECT(
            PARAM({ name: 'foo', value: 'bar'})
        ),
        'G',
        APPLET('Not suppoerted'),
        'H',
        CANVAS('Not supported'),
        'I',
        AUDIO(
            SOURCE({ type: 'audio/ogg' }),
            'Not supported'
        ),
        'J',
        BR(),
        'K',
        EMBED('Not supported'),
        'L',
        IFRAME({ src: 'http://www.example.com' }),
        'M',
        METER({ min: 0, max: 10, value: 3 }, '3/10'),
        'N',
        PROGRESS({ value: 5, max: 10 }, '5/10'),
        'O'
    )
});