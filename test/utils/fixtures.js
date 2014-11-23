/* global DOMBuilder, $ */

/**
 * Manages test fixtures.
 * @global
 */
var fixtures = (function (global) {
    'use strict';

    var FIXTURES_DIR = 'fixtures',
        fixtures = {};

    // Patch DOMBuilder.createElement so that it accepts a few special options
    var _createElement = DOMBuilder.createElement;
    DOMBuilder.createElement = function (tagName, attr, children, mode) {
        attr = attr || {};

        if (attr.color) {
            attr.style = 'background-color: ' + attr.color;
            delete attr.color;
        }

        if (attr.marked) {
            attr['data-marked'] = attr.marked;
            delete attr.marked;
        }

        if (attr.startNode) {
            attr['data-start-node'] = attr.startNode;
            delete attr.startNode;
        }

        if (attr.endNode) {
            attr['data-end-node'] = attr.endNode;
            delete attr.endNode;
        }

        return _createElement.call(DOMBuilder, tagName, attr, children, mode);
    };

    // Add method which builds highlight span element
    DOMBuilder.dom.HIGHLIGHT = function () {
        var args = Array.prototype.slice.call(arguments),
            attr = {},
            children = args;

        if (typeof args[0] === 'object') {
            attr = args.shift();
        }

        attr.class = 'highlighted';
        attr['data-highlighted'] = true;

        return DOMBuilder.createElement('span', attr, children, this.mode);
    };

    DOMBuilder.dom.APPLET = function () {
        var args = Array.prototype.slice.call(arguments),
            attr = {},
            children = args;

        if (typeof args[0] === 'object') {
            attr = args.shift();
        }

        return DOMBuilder.createElement('applet', attr, children, this.mode);
    };

    /**
     * Load fixture file in synchronous manner.
     * @param {string} name - name of the fixture
     */
    function loadFixture(name) {
        var file = FIXTURES_DIR + '/' + name + '.js';

        $.ajax({
            url: file,
            dataType: 'script',
            async: false
        });
    }

    /**
     * Loads fixtures from given array
     * @param {string[]} names - array of fixture files to load
     */
    function loadFixtureFiles(names) {
        var fixturesLength = names.length,
            i = 0;

        for (; i < fixturesLength; ++i) {
            loadFixture(names[i]);
        }

    }

    /**
     * Returns fixture as DOM tree
     * @param {string} name - fixture name
     * @param {boolean} removeMarkedAttr - if set to true, any 'marked' attributes are removed
     * @returns {Node} - root node of fixture
     */
    function getFixture(name, removeMarkedAttr) {
        var fixture = fixtures[name],
            el;

        if (typeof fixture === 'undefined') {
            throw 'Fixture ' + name + ' not found!';
        }

        el = fixture.cloneNode(true);

        if (removeMarkedAttr) {
            $('<div></div>').append(el).find('[data-marked]').removeAttr('data-marked');
        }

        return el;
    }

    /**
     * Returns fixture as HTML string
     * @param {string} name - fixture name
     * @param {boolean} removeMarkedAttr - if set to true, any 'marked' attributes are removed
     * @returns {string}
     */
    function getFixtureAsHtml(name, removeMarkedAttr) {
        return getFixture(name, removeMarkedAttr).outerHTML;
    }

    /**
     * Registers fixture under given name. After calling this function a fixture can be retrieved using its name.
     * @param {string} name - name of the fixture
     * @param {function} func - Function which defines the fixture
     */
    function registerFixture(name, func) {
        var funcStr = func.toString(),
            funcBody = funcStr.slice(funcStr.indexOf('{') + 1, funcStr.lastIndexOf('}')).trim();

        fixtures[name] = global.domBuilderEval(funcBody);
    }

    /**
     * Clears internal fixtures array
     */
    function clearFixtures() {
        fixtures = {};
    }

    return {
        get: getFixture,
        getAsHtml: getFixtureAsHtml,
        loadFiles: loadFixtureFiles,
        clear: clearFixtures,
        register: registerFixture
    };
})(window);

(function (global) {

    // eval + with, hell yeah!
    global.domBuilderEval = function (code) {
        with (DOMBuilder.dom) {
            return eval('(function () { return ' + code + '; })()');
        }
    };

})(window);