/*
*
* Emailer helper
*
* */

var config = require('../config/config');
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    host: config.emailerURL, // hostname
    secure: true, // use SSL
    port: config.emailerPORT, // port for secure SMTP
    auth: {
        user: config.emailerUSER,
        pass: config.emailerPASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

var mail_helper = {
    sendHtmlEmail: function(toEmail, subject, html, callback) {
        var mailOptions = {
            from: '"' + config.emailerFROM.name + '" <' + config.emailerFROM.email + '>', // sender address
            to: toEmail, // list of receivers
            subject: subject, // Subject line
            html: html // html body
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return callback(error, null);
            }

            console.log('Message sent: ' + info.response);

            callback(null, info.response);
        });
    }

};

module.exports = mail_helper;