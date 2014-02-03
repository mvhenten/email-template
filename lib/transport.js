'use strict';

var Wolperting = require('class-wolperting'),
    nodemailer = require('nodemailer');

module.exports = Wolperting.create({

    service: String,

    auth: Object,

    send: function(options, done) {
        var ts = nodemailer.createTransport('SMTP', this);
        ts.sendMail(options, done);
    }
});
