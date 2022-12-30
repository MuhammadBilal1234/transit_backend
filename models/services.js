var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.Promise = require('q').Promise;


var ServicesSchema = new mongoose.Schema({
    userID: {type: String, index: true},
    Monday: Boolean,
    Tuesday: Boolean,
    Wednesday: Boolean,
    Thursday: Boolean,
    Fryday: Boolean,
    Saturday: Boolean,
    Sunday: Boolean,
    startDate: String,
    endDate: String,
    serviceName: {type: String, index: true}

}, { collection: 'real_services' });

ServicesSchema.plugin(timestamps);
module.exports = mongoose.model('services', ServicesSchema);