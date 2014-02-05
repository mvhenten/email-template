# peryton

*A simple API to send emails formatted with various templating libs.*

This module also wraps [nodemailer](http://www.nodemailer.com/), making e-mail sending easy. 

[![Build Status](https://drone.io/github.com/mvhenten/peryton/status.png)](https://drone.io/github.com/mvhenten/peryton/latest)

nodemailer transport, provide a link ), and what the arguments to Template are

# Templating engines

The following templating engines are supported. The dependencies listed are required in order to run them along with this library. 

- [swig](http://paularmstrong.github.io/swig/), ```npm install swig --save```, [https://github.com/paularmstrong/swig/](https://github.com/paularmstrong/swig/)
- [jade](http://jade-lang.com/), ```npm install jade --save```, [https://github.com/visionmedia/jade](https://github.com/visionmedia/jade)

# API

##### swig

The following example illustrates how to use ```peryton``` with ```swig``` template engine.

For ```swig``` it's also possible to define custom [filters](http://paularmstrong.github.io/swig/docs/filters/):

```javascript
    var Email = require('peryton'),
        email = Email.create({
            // route to your template file
            template: 'file.html',
            // before you can send any e-mails you need to set up a transport method
            transport: Email.Transport({
                service: 'Gmail', 
           	auth: { 
                    username: "username@gmail.com", 
                    password: "yourpassword" 
                }
	    }),
            // use swig
            engine: Email.Swig({
                config: {
                    cache: process.env['NODE_ENV'] === 'production' ? 'memory' : false,
                },
                // define custom filters
                filters: { 
                    smurf: function(str){ 
                        return str.replace(/\w+/g,'smurf') 
                    } 
                }
            }),
        });

    email.send( to, from, subject, locals, function( err, email ){
        // return callback gets two parameters: err, mail
    });
```

##### jade

In the case of ```jade```, you will need to define your [mixins](http://jade-lang.com/reference/#mixins):

```javascript
engine: Email.Jade({
    config: {
        cache: process.env['NODE_ENV'] === 'production' ? 'memory' : false,
    },
    // define custom mixins
    mixins: { 
       smurf: function(str){ 
           return str.replace(/\w+/g,'smurf') 
       } 
    }
})
```
# Install

The source is available for download from [GitHub](https://github.com/mvhenten/peryton). Alternatively, you can install using Node Package Manager (npm):

```
npm install peryton --save
```

