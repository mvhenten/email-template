'use strict';

var Wolperting = require('class-wolperting'),
    htmlToTxt = require('html-to-text'),
    Transport = require('./transport');

var Email = Wolperting.create({

    template: String,

    engine: {
        $isa: Wolperting.Types.DuckType('TemplateEngine', {
            render: Function
        })
    },

    transport: Transport,

    send: function(to, from, subject, locals, done) {
        this.template.render(this.template, locals, function(err, html) {
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

    Transport: Transport,

    Template: {
        get Swig() {
            return require('template/swig');
        },

        get Jade() {
            return require('template/jade');
        }
    },
};
