'use strict';

var swig = require('swig');

module.exports = function(args) {
    var cache = {}, tpl = new swig.Swig(args.config || {});

    if (args.filters) {
        for (var name in args.filters) {
            tpl.setFilter(name, args.filters[name]);
        }
    }

    return {
        render: function(template, locals, done) {
            var render = cache || (cache = tpl.compile(template, locals));

            done(null, render(locals));
        }
    };
};
