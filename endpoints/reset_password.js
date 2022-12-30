var express = require('express');
var router = express.Router();
var config = require('../config/config');
var emailHelper = require('../helpers/mail_helper');
var users = require('../models/users');
var ejs = require('ejs');
var async = require('async');
var SHA256 = require("crypto-js/sha256");
router.post('/', function (req, res) {

    //VARIABLES METHODS
    var email = req.body.Object.email;

    if (email == '') {
        return res.json({success: false, message: 'Missing obligatory parameters'});
    }

    var deleteExpiredIndexes = function (cb) {
        users.find({resetHashExpire: {$lt: new Date()}}, function (err, data) {
            if (err) {
                return cb(err, null);
            }

            if (data.length > 0) {
                data.forEach(function (element, index) {
                    users.findOneAndUpdate({email: element.email}, {
                        resetHash: undefined,
                        resetHashExpire: undefined
                    }, function (err, dt) {
                        if (err) {
                            console.log(err);
                        } else {

                            console.log(dt.displayName + ' deleting reset link - expired !!!');
                            if(index + 1 == data.length) {
                                return cb(null, 'OK');
                            }
                        }
                    })
                });

            } else {
                return cb(null, 'OK');
            }

        })
    };

    var doesEmailExists = function (cb) {
        //test
        users.getUserByEmail(email, function (err, result) {

            if (err) {
                return cb(err, null);
            }

            if (!result) { //This is important - if {email:email,confirmed:true} does not exist then perhaps is not
                // confirmed?
                users.findOne({email: email, confirmed: false}, function (err, result) {
                    if (err) {
                        return cb(err, null);
                    }

                    if (result) {
                        return cb('Your email is not confirmed, please check your email for confirmation email with' +
                            ' link.', null);
                    }

                    return cb('You are not registered at ' + config.webName, null);
                });

            } else {
                var resetHash = +new Date() + result.displayName + config.someSalt;
                var rHash = SHA256(resetHash).toString();
                var d1 = new Date();
                var d2 = new Date(d1);
                d2.setHours(d1.getHours() + 2);
                users.findOneAndUpdate({email: email, confirmed: true}, {
                    resetHash: rHash,
                    resetHashExpire: d2
                }, function (err, data) {
                    if (err) {
                        return cb(err, null);
                    }

                    ejs.renderFile('./views/reset_password.ejs', {
                        hashedTag: rHash,
                        baseURL: config.webAppBaseURL,
                        displayName: data.displayName,
                        signature: config.emailerFROM.signature,
                        webName: config.webName,
                        webLogo: config.webLogo
                    }, {}, function (err, html) {
                        if (err) {
                            return cb(err, null);
                        }

                        emailHelper.sendHtmlEmail(email, 'Reset password request at ' + config.webName, html, function (err, result) {
                            console.log(err, result);
                        })
                    });

                    return cb(null, 'Reset passwords instructions ware sent to ' + email + '. Please hurry' +
                        ' up, reset' +
                        ' link is going to be active in the next two hours only.');
                });
            }


        });
    };

    async.series([
        deleteExpiredIndexes,
        doesEmailExists
    ], function (err, results) {
        if (err) {
            return res.json({success: false, message: err});
        }

        return res.json({success: true, message: results[1]});
    });

});

module.exports = router;
