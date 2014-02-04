'use strict';

var Jade = require('jade'),
    _ = require('lodash'),
    fs = require('fs');

var cache = {};

function _read(path, done) {
    if (cache[path]) return done(null, cache[path]);

    fs.readFile(path, 'utf8', function(err, str) {
        cache[path] = str || err;

        if (err) return done(err);
        done(err, str);
    });
}

module.exports = function(args) {
    var render = null,
        tpl = Jade;

    return {
        render: function(template, locals, done) {
            _read(template, function(err, template) {

                if (!render) render = tpl.compile(template, _.extend(locals, args.mixins));
                done(null, render(locals));
            });
        }

    };
};
