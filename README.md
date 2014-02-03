var Cmail = require('consolidate-email');


var mail = new Cmail({
    from: 'you@domain.com',
    to: 'someone@example.com',
    subject: 'Hello theere',
    transport: {
        type: 'SMTP',
        service: 'Gmail',
        auth: {
            user: 'someone@gmail.com',
            pass: 'Secret pass'
        }
    },
    template: {
        path: 'email/email.html',
        type: 'swig',
        context: {
            user: 'someone',
            other: 'things'
        }
    },
})
