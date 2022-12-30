var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
mongoose.Promise = require('q').Promise;

var FilesSchema = new mongoose.Schema({
    userID: {type: String, index: true},
    time: {type: String, index: true},
    routes: [String]
});

FilesSchema.plugin(timestamps);
module.exports = mongoose.model('gtfsFiles', FilesSchema);