'use strict';

var Email = require('../lib/email'),
    _ = require('lodash'),
    fs = require('fs'),
    Mock = require('mock-nodemailer'),
    diff = require('assert-diff'),
    assert = require('assert'),
    Faker = require('Faker');


suite(__filename, function() {

    test('Email.send must render a template', function(done) {
        var file = Date.now().toString(36),
            from = Faker.Internet.email(),
            to = Faker.Internet.email(),
            subject = Faker.Lorem.sentence(),
            locals = {
                words: Faker.Lorem.words()
            };

        var mail = Email.create({
            template: file + '.html',
            transport: {
                send: function(args, done) {
                    done(null, args);
                }
            },

            engine: {
                render: function(path, locals, done) {
                    assert.equal(path, file + '.html');
                    done(null, '<b>' + locals.words.join(', ') + '</b>');
                }
            }
        });

        mail.send(to, from, subject, locals, function(err, data) {
            var expect = {
                from: from,
                to: to,
                subject: subject,
                html: '<b>' + locals.words.join(', ') + '</b>',
                text: locals.words.join(', ')
            };


            diff.deepEqual(data, expect, 'send invoked template rendering and transport.send');
            done();
        });
    });

    test('Email.Transport invokes nodemailer', function(done) {
        var args = {
            from: Faker.Internet.email(),
            to: Faker.Internet.email(),
            words: Faker.Lorem.words(),
            subject: Faker.Lorem.sentence()
        };

        Mock.expectEmail(args, done);

        var ts = Email.Transport();
        ts.send(args, _.noop);
    });

    test('Email.Template.Swig returns swig renderer', function(done) {
        var words = Faker.Lorem.words(),
            path = __dirname + '/' + Date.now().toString(36);

        fs.writeFileSync(path, '<b>{{ words|smurf }}</b>');

        var tpl = Email.Template.Swig({
            filters: {
                smurf: function(str) {
                    return str.replace(/\w+/g, 'smurf');
                }
            }
        });

        tpl.render(path, {
            words: words.join(', ')
        }, function(err, html) {
            var smurfs = _.times(words.length, function() {
                return 'smurf';
            });

            assert.equal(html, '<b>' + smurfs.join(', ') + '</b>');
            fs.unlinkSync(path);
            done();
        });

    });

    test('Email.Template.Jade returns jade renderer', function(done) {
        var words = Faker.Lorem.words(),
            smurfs = _.times(words.length, function() {
                return 'smurf';
            }),
            expect = '<b>' + smurfs.join(', ') + '</b>',
            path = __dirname + '/' + Date.now().toString(36);

        var tpl = Email.Template.Jade({
            mixins: {
                smurf: function(str) {
                    return str.replace(/\w+/g, 'smurf');
                }
            }
        });

        fs.writeFileSync(path, 'b\n\t=smurf(words)');

        tpl.render(path, {
            words: words.join(', ')
        }, function(err, html) {
            assert.equal(html, expect);
            fs.unlinkSync(path);
            done();
        });
    });

});
