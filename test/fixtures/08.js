fixtures.register('08', function () {
   DIV(
       HIGHLIGHT({ color: 'green' },
           'Lorem ',
           HIGHLIGHT({ color: 'red', marked: true }, 'ipsum')
       ),
       HIGHLIGHT({ color: 'red', marked: true }, ' dolor '),
       HIGHLIGHT({ color: 'green' },
           HIGHLIGHT({ color: 'red', marked: true }, 'sit'),
           ' amet.'
       )
   )
});