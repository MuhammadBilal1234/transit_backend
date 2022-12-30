/*
*
* Custom scripts for authentication handle - memcached token lou_cifer;
*
* */

var config = require('../config/config');
var CryptoJS = require('crypto-js');
var Memcached = require('memcached');
var bcrypt = require('bcrypt');
var memcached = new Memcached(config.memcachedInfo, {
    maxExpiration: config.expirationTime
});
var expirationTime = config.expirationTime;

var auth_helper = {
    saveMemcached: function(token, user, callback) {
        'use strict';
        user.password = undefined;
        //First checking for old instances of same user:
        memcached.get('user' + String(user.id), function(err, data) {


            //if any => delete:
            if (data) {
                memcached.del(data, function(err) {
                    console.log('memcached.del', err);
                });
            }

            memcached.set(token, user, expirationTime, function(err) {
                if (err) {
                    console.log('saveMemcached ERROR', err);
                }

                memcached.set('user' + String(user.id), token, expirationTime, function(err) {
                    if (err) {
                        console.log('saveMemcached ERROR', err);
                    }

                    callback();
                });


            });
        });

    },
    memcachedGetUrl: function (url,callback) {
        memcached.get(url, function(err, data) {
            if (err) return callback(err, null);

            callback(null,data);

        });
    },
    memcachedSetUrl: function (url, html, callback) {
        memcached.set(url, html,expirationTime, function(err) {
            if (err) return callback(err, null);

            callback(null,true);

        });
    },
    hashPass: function(password, callback) {
        bcrypt.hash(password, 10, function(err, hash) {
            if (err) {
                return callback(err, null);

            }

            callback(null, hash);
            // Store hash in your password DB.
        });
    },
    memcachedGetUser: function(token, callback) {
        'use strict';
        memcached.get(token, function(err, data) {

            if (err) {
                console.log('memcachedGetUser:', err);
                return callback(err, null);

            }

            callback(null, data);
        });
    },

    makeToken: function(user, callback) {
        'use strict';
        var token = String(user.id) + user.email;
        var ciphertext = CryptoJS.AES.encrypt(token, config.secret);

        callback(ciphertext.toString());

    },

    ensureAuth: function (req, res, next) {
        'use strict';

        var header = req.headers.authorization || '';
        if (header === '') {
            return res.status(403).json({success: false, message: 'Missing token.'});
        }
        auth_helper.memcachedGetUser(header, function (err, data) {
            if (err || data === undefined) {
                return res.status(403).json({success: false, message: 'Token expired.'});
            }
            req.decoded = data;

            next();
        });
    }
};

module.exports = auth_helper;