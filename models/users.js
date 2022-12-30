var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.Promise = require('q').Promise;

var UsersSchema = new mongoose.Schema({
    displayName: String,
    email: {type: String, index: true, unique: true},
    password: String,
    role: String,
    facebookId: {type: String, index: true, unique: true},
    googleId: {type: String, index: true, unique: true},
    confirmed: {type: Boolean, index: true},
    confHash: {type: String, index: true},
    photo: String,
    adress: String,
    phone: String,
    resetHash: {type: String, index: true},
    resetHashExpire: {type: Date, index: true}
});

UsersSchema.statics.getUserByEmail = function (email, cb) {
    return this.findOne({email: email, confirmed: true}, cb);
};

UsersSchema.statics.getUserByFbId = function (fbId, cb) {
    return this.findOne({facebookId: fbId, confirmed: true}, cb);
};

UsersSchema.statics.getUserByGoogleId = function (fbId, cb) {
    return this.findOne({googleId: fbId, confirmed: true}, cb);
};

UsersSchema.statics.getUnconfirmedFromHash = function (id, confHash, cb) {
    return this.findOne({id: id, confHash: confHash}, cb);
};

UsersSchema.plugin(timestamps);
module.exports = mongoose.model('users', UsersSchema);