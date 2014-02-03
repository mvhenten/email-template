'use strict';

var Wolperting = require('class-wolperting'),
    nodemailer = require('nodemailer'),
    htmlToTxt = require('html-to-text');

var Email = Wolperting.create({

    template: String,

    engine: {
        $isa: Wolperting.Types.DuckType('TemplateEngine', {
            render: Function
        })
    },

    transport: {
        $isa: Wolperting.Types.DuckType('TransportEngine', {
            send: Function
        })
    },

    send: function(to, from, subject, locals, done) {
        this.engine.render(this.template, locals, function(err, html) {
            this.transport.send({
                from: from,
                to: to,
                subject: subject,
                html: html,
                text: htmlToTxt.fromString(html, {
                    wordwrap: 130
                })
            }, done);
        }.bind(this));
    }
});


module.exports = {
    create: function(args) {
        return new Email(args);
    },

    Transport: function(options) {
        return Object.create({
            send: function(args, done) {
                var ts = nodemailer.createTransport('SMTP', options || {});
                ts.sendMail(args, done);
            }
        });
    },

    Template: {
        get Swig() {
            return require('template/swig');
        },

        get Jade() {
            return require('template/jade');
        }
    },
};
