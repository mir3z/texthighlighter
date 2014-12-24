/* global sandbox */

/**
 * Initializes test harness and starts Jasmine test runner.
 * @global
 */
var testSuite = (function () {
    'use strict';

    /**
     * Renders sandbox.
     * @param params
     */
    function initSandbox(params) {
        var target = document.body;

        params = params || {};

        if (params.inIframe) {
            target = createIframe();
        }

        target.appendChild(sandbox.render());
    }

    /**
     * Creates iframe and adds it to the document.
     * @returns {HTMLElement} - body element of the iframe.
     */
    function createIframe() {
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

        /**
         * Initializes sandbox and starts Jasmine tests.
         * @param params
         * @param {boolean} params.inIframe - if set to true, sandbox will be placed into the iframe.
         */
        initialize: function (params) {
            window.onload = function () {
                initSandbox(params);

                // Wait for the iframe...
                window.setTimeout(function () {
                    window.runJasmine(); // defined in jasmine/boot.js
                }, 50);
            };
        }

    };

})();