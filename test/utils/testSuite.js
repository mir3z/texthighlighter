var testSuite = (function () {
    'use strict';

    function initializeIframe() {
        var iframe = document.createElement('iframe'),
            body;

        document.body.appendChild(iframe);
        body = iframe.contentDocument.body;

        // Yet another IE fuck up - the iframe's body is null, so lets create it.
        if (!body) {
            iframe.contentDocument.write('<body></body>');
            // refresh reference
            body = iframe.contentDocument.body;
        }

        return body;
    }

    return {

        initialize: function (params) {
            window.onload = function () {
                testSuite.initSandbox(params);

                window.setTimeout(function () {
                    window.runJasmine(); // defined in jasmine/boot.js
                }, 50);
            };
        },

        initSandbox: function (params) {
            var target = document.body;

            params = params || {};

            if (params.inIframe) {
                target = initializeIframe();
            }

            sandbox.render().appendTo(target);
        }

    };

})();