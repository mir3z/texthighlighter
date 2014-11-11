var fixtures = (function () {
    'use strict';

    var FIXTURES_DIR = 'fixtures';
    var fixtures = {};

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

    DOMBuilder.dom.HIGHLIGHT = function () {
        var args = Array.prototype.slice.call(arguments),
            attr = {},
            children = args;

        if (typeof args[0] === 'object') {
            attr = args.shift();
        }

        attr.class = 'highlighted';

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

    function loadFixture(name, callback) {
        var file = FIXTURES_DIR + '/' + name + '.js';

        $.ajax({
            url: file,
            dataType: 'script',
            async: false,
            success: function () {
                if (typeof callback === 'function') {
                    callback();
                }
            }
        });
    }

    function loadFixtures(names, callback) {
        var fixturesLength = names.length,
            i = 0;

        function supervise(data) {
            if (i === fixturesLength - 1) {
                callback();
            } else {
                loadFixture(names[++i], supervise);
            }
        }

        loadFixture(names[i], supervise);
    }

    function getFixture(name, removeMarkedAttr) {
        var fixture = fixtures[name],
            el;

        if (typeof fixture === 'undefined') {
            throw 'Fixture ' + name + ' not found!';
        }

        el = fixture.cloneNode(true);

        if (removeMarkedAttr) {
            $('<div></div>').append(el).find('[data-marked=true]').removeAttr('data-marked');
        }

        return el;
    }

    function getFixtureAsHtml(name, removeMarkedAttr) {
        return getFixture(name, removeMarkedAttr).outerHTML;
    }

    function registerFixture(name, func) {
        var funcStr = func.toString(),
            funcBody = funcStr.slice(funcStr.indexOf('{') + 1, funcStr.lastIndexOf('}')).trim();

        fixtures[name] = domBuilderEval(funcBody);
    }

    function clearFixtures() {
        fixtures = {};
    }

    return {
        get: getFixture,
        getAsHtml: getFixtureAsHtml,
        load: loadFixtures,
        clear: clearFixtures,
        register: registerFixture
    };
})();

(function () {

    // eval + with, hell yeah!
    window.domBuilderEval = function (code) {
        with (DOMBuilder.dom) {
            return eval('(function () { return ' + code + '; })()');
        }
    };

})();