/* global jQuery, TextHighlighter */

(function ($) {
    'use strict';

    var PLUGIN_NAME = 'textHighlighter';

    function wrap(fn, wrapper) {
        return function () {
            wrapper.call(this, fn);
        };
    }

    $.fn.getHighlighter = function () {
        return this.data(PLUGIN_NAME);
    };

    $.fn[PLUGIN_NAME] = function (options) {
        return this.each(function () {
            var el = this,
                hl;

            if (!$.data(el, PLUGIN_NAME)) {
                hl = new TextHighlighter(el, options);

                hl.destroy = wrap(hl.destroy, function (destroy) {
                    destroy.call(hl);
                    $(el).removeData(PLUGIN_NAME);
                });

                $.data(el, PLUGIN_NAME, hl);
            }
        });
    };

})(jQuery);
