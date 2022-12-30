var config = require('./../config/config');
var authHelper = require('../helpers/auth_helper');

module.exports = function (passport, Strategy, GoogleStrategy, usersModel) {

    passport.use(new GoogleStrategy({
            clientID: config.googleClientID,
            clientSecret: config.googleClientSecret,
            callbackURL: "/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, cb) {

            usersModel.getUserByGoogleId(profile.id, function (err, result) {
                if (err) {
                    return cb(err, null);
                }

                if (result) {
                    result.password = undefined;
                    authHelper.makeToken(result, function (token) {
                        authHelper.saveMemcached(token, result, function () {
                            return cb(null, token);
                        })
                    });

                } else {
                    profile.needRegistration = true;
                    return cb(null, profile);
                }

            });

        }
    ));

    passport.use(new Strategy({
            clientID: config.FACEBOOK_APP_ID,
            clientSecret: config.FACEBOOK_APP_SECRET,
            callbackURL: config.FACEBOOK_CALLBACK_URL
        },
        function (accessToken, refreshToken, profile, cb) {

            usersModel.getUserByFbId(profile.id, function (err, result) {
                if (err) {
                    return cb(err, null);
                }

                if (result) {
                    result.password = undefined;
                    authHelper.makeToken(result, function (token) {
                        authHelper.saveMemcached(token, result, function () {
                            return cb(null, token);
                        })
                    });

                } else {
                    profile.needRegistration = true;
                    return cb(null, profile);
                }

            });

        }));
    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
    });
};