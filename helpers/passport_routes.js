var config = require('./../config/config');
var authHelper = require('../helpers/auth_helper');

module.exports = function (passport, app) {

    app.get('/auth/facebook',
        passport.authenticate('facebook'));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {failureRedirect: config.mainWebHttpFailedLoginCallback}),
        function (req, res) {
            if (req.user.needRegistration) {
                return res.redirect(config.mainWebHttpUnRegisteredLoginCallback + '?displayName=' + req.user.displayName + '&facebookId=' + req.user.id);
            }
            return res.redirect(config.mainWebHttpSuccessLoginCallback + encodeURIComponent(req.user));
        });

    app.get('/auth/google',
        passport.authenticate('google', { scope:[
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email']}
        ));

    app.get( '/auth/google/callback',
        passport.authenticate( 'google',{failureRedirect: config.mainWebHttpFailedLoginCallback}),
        function (req, res) {
            if (req.user.needRegistration) {
                return res.redirect(config.mainWebHttpUnRegisteredLoginCallback + '?displayName=' + req.user.displayName + '&googleId=' + req.user.id + '&email=' + req.user.emails[0].value);
            }
            return res.redirect(config.mainWebHttpSuccessLoginCallback + encodeURIComponent(req.user));
        });

};