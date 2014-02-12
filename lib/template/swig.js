'use strict';

var swig = require('swig'),
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

function _setTags(tpl, tags) {
    _.each(tags, function(tag, name) {
        tpl.setTag(name, tag.parse, tag.compile, tag.ends, tag.blockLevel);

        if (tag.ext) {
            tpl.setExtension(tag.ext.name, tag.ext.obj);
        }
    });
}

module.exports = function(args) {
    var render = null,
        tpl = new swig.Swig(args.config || {});

    if (args.filters) {
        _.each(args.filters, function(filter, name) {
            tpl.setFilter(name, filter);
        });
    }

    if (args.tags) {
        _setTags(tpl, args.tags);
    }

    return {
        render: function(template, locals, done) {
            _read(template, function(err, template) {
                if (!render) render = tpl.compile(template, locals);

                done(null, render(locals));
            });
        }
    };
};
