var express = require('express');
var router = express.Router();
var config = require('../config/config');
var authHelper = require('../helpers/auth_helper');
var users = require('../models/users');
var ejs = require('ejs');
var async = require('async');
var SHA256 = require("crypto-js/sha256");
router.post('/', function (req, res) {

    //VARIABLES METHODS
    if(req.body.Object != undefined) {
        var email = req.body.Object.email;
        var password = req.body.Object.password;
        var hash = req.body.Object.hash;
        var hashedPassword = null;
    }


    if (req.body.Object == undefined || email == '' || password == '' || hash == '' || email == null || password == null || hash == null) {
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

    var hashThisPass = function (callback) {
        authHelper.hashPass(password, function (err, result) {
            if (err) {
                return callback(err, null);
            }
            hashedPassword = result;
            callback(null, result);
        });
    };

    var findByEmailAndHash = function(cb) {
        users.findOneAndUpdate({email: email, resetHash: hash},{resetHash: undefined, resetHashExpire: undefined, password: hashedPassword}, function (err, result) {
            if(err) {
                return cb(err, null);
            }

            if(!result) {
                return cb('We could not find reset password link. Perhaps your link expired? Try to request it again.');
            }

            cb(null, 'New password was set. Go, login now. Redirecting in 5 sec...')
        })
    };

    async.series([
        deleteExpiredIndexes,
        hashThisPass,
        findByEmailAndHash
    ], function (err, results) {
        if (err) {
            return res.json({success: false, message: err});
        }

        return res.json({success: true, message: results[2]});
    });

});

module.exports = router;
