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
var gtfs_calendarShema = new mongoose.Schema({
    userID: {type: String, index: true},
    createGtfsTime: {type: Number, index: true},
    service_id: String,
    monday: Boolean,
    tuesday: Boolean,
    wednesday: Boolean,
    thursday: Boolean,
    friday: Boolean,
    saturday: Boolean,
    sunday: Boolean,
    start_date: Date,
    end_date: Date,

}, { collection: 'gtfs_calendar' });

gtfs_calendarShema.plugin(timestamps);
module.exports = mongoose.model('gtfs_calendar', gtfs_calendarShema);