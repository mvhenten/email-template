'use strict';

var Email = require('../lib/email'),
    _ = require('lodash'),
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

});
