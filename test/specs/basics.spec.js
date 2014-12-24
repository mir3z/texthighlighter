/* global describe, it, afterEach, beforeEach, expect, fixtures, sandbox, $, TextHighlighter */

describe('Basics', function () {
    'use strict';

    var hl;

    beforeEach(function () {
        hl = sandbox.init();
    });

    afterEach(function () {
        sandbox.empty();
    });

    it('initialization', function () {
        expect(TextHighlighter).toBeDefined();
        expect(TextHighlighter.createWrapper).toBeDefined();
        expect($.fn.textHighlighter).toBeDefined();
        expect($.data(sandbox.el).textHighlighter).toBeDefined();

        expect(sandbox.$el.hasClass('highlighter-context')).toBeTruthy();
    });

    it('destroying', function () {
        hl.destroy();

        expect(sandbox.$el.hasClass('highlighter-context')).toBeFalsy();
        expect($.data(sandbox.el).textHighlighter).not.toBeDefined();
    });

    it('set/get highlight color', function () {
        var wrapper;

        expect(hl.options.color).toEqual('#ffff7b');

        hl.setColor('green');
        expect(hl.options.color).toEqual('green');

        wrapper = TextHighlighter.createWrapper(hl.options);
        expect(wrapper.style.backgroundColor).toEqual('green');

        expect(hl.getColor()).toEqual('green');
    });
});