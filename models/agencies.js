var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.Promise = require('q').Promise;

/*
 agency_id
agency_name
agency_url
agency_timezone
agency_lang
agency_phone
agency_fare_url
* */
var AgenciesSchema = new mongoose.Schema({
    userID: {type: String, index: true},
    agency_id: String,
    agency_name: String,
    agency_url: String,
    agency_timezone: String,
    agency_lang: String,
    agency_phone: String,
    agency_fare_url: String

}, { collection: 'real_agencies' });

AgenciesSchema.plugin(timestamps);
module.exports = mongoose.model('agencies', AgenciesSchema);