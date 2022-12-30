var express = require('express');
var router = express.Router();
var users = require('../models/users');
var authHelper = require('../helpers/auth_helper');
var emailHelper = require('../helpers/mail_helper');
var SHA256 = require("crypto-js/sha256");
var ejs = require('ejs');
var async = require('async');
var config = require('../config/config');
router.post('/', function (req, res) {

    //VARIABLES METHODS
    var email = req.body.email;
    var password = req.body.password;
    var displayName = req.body.displayName;
    var facebookId = req.body.facebookId;
    var googleId = req.body.googleId;
    var hashedTag = null;
    var hashedPassword = null;
    var userId = null;
    var subject = 'Please Confirm Your Account';

    if (email == '' || password == '' || displayName == '') {
        return res.json({success: false, message: 'Missing obligatory parameters'});
    }


    var htmlTemplate = function (callback) {
        ejs.renderFile('./views/email_confirmation.ejs', {
            hashedTag: hashedTag,
            baseURL: config.webAppBaseURL,
            userId: userId,
            displayName: displayName,
            signature: config.emailerFROM.signature,
            webName: config.webName,
            webLogo: config.webLogo
        }, {}, function (err, html) {
            if (err) {
                return callback(err, null);
            }

            emailHelper.sendHtmlEmail(email, subject, html, function (err, result) {
                if (err) {
                    return callback(err, null);
                }

                callback(err, 'OK');
            })
        });
    };

    var confHash = +new Date() + ' ' + email + displayName;
    hashedTag = SHA256(confHash);


    var hashThisPass = function (callback) {
        authHelper.hashPass(password, function (err, result) {
            if (err) {
                return callback(err, null);
            }
            hashedPassword = result;
            callback(null, result);
        });
    };

    var registerUser = function (callback) {


        var newUser = new users({
            email: email,
            password: hashedPassword,
            displayName: displayName,
            confirmed: false,
            confHash: hashedTag,
            facebookId: facebookId,
            googleId: googleId
        });

        newUser.save()
            .then(function (result) {

                userId = result.id;
                htmlTemplate(function (err, re) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(re);
                    }

                });
                callback(null, 'User Registered, please check your email for confirmation before login! Please' +
                    ' check spam folder too.');
            })
            .catch(function (err) {
                if (err) {
                    return callback(err, null);
                }
            })
        ;


    };


    //ACTUAL LOGIC

    async.series([
            hashThisPass,
            registerUser
        ],
        function (err, results) {
            if (err) {
                console.log(err);
                return res.json({success: false, message: 'This email is already registered?'});
            }

            res.json({success: true, message: results[1]});
        }
    );

});

module.exports = router;
