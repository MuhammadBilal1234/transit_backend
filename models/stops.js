var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.Promise = require('q').Promise;

var StopsSchema = new mongoose.Schema({
    stop_id: {type:Number, index: true},
    stop_code: {type:Number, index: true},
    stop_name: String,
    stop_desc: String,
    stop_lat: Number,
    stop_lon: Number,
    loc: {
        type: { type: String },  // [<longitude>, <latitude>],
        coordinates: Array
             // create the geospatial index
    },
    zone_id: String,
    stop_url: String,
    location_type: String,
    parent_station: String,
    userID: {type: String, index: true}
}, { collection: 'real_stops' });

// StopsSchema.statics.getUserByEmail = function (email, cb) {
//     return this.findOne({email: email, confirmed: true}, cb);
// };
//
// StopsSchema.statics.getUserByFbId = function (fbId, cb) {
//     return this.findOne({facebookId: fbId, confirmed: true}, cb);
// };
//
// StopsSchema.statics.getUserByGoogleId = function (fbId, cb) {
//     return this.findOne({googleId: fbId, confirmed: true}, cb);
// };
//
// StopsSchema.statics.getUnconfirmedFromHash = function (id, confHash, cb) {
//     return this.findOne({id: id, confHash: confHash}, cb);
// };
StopsSchema.index({ loc: '2dsphere' });
StopsSchema.plugin(timestamps);
module.exports = mongoose.model('stops', StopsSchema);