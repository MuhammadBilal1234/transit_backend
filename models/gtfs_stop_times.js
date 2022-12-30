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
var gtfs_StopTimesShema = new mongoose.Schema({
    userID: {type: String, index: true},
    createGtfsTime: {type: String, index: true},
    stopTime: Date,
    route_id: String,
    service_id: String,
    trip_id: String,
    arrival_time: String,
    departure_time: String,
    stop_id: String,
    stop_sequence: String,
    stop_headsign: String,
    pickup_type: String,
    drop_off_type: String,
    shape_dist_traveled: String,
    frequency: String,
    Service_repeat:Number

}, { collection: 'gtfs_stop_times' });

gtfs_StopTimesShema.plugin(timestamps);
module.exports = mongoose.model('gtfs_stop_times', gtfs_StopTimesShema);