var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var services = require('./services');
mongoose.Promise = require('q').Promise;

var RoutesSchema = new mongoose.Schema({
    userID: {type: String, index: true},
    route: Object,
    serviceID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'services' }],
    frequency: Array,
    routeName: String,
    routeID: String,
    startRouteTime: Object,
    endRouteTime: Object,
    routeDesc: String,
    totalTime: String,
    routeLength: String
}, { collection: 'real_routes' });

RoutesSchema.plugin(timestamps);
module.exports = mongoose.model('routes', RoutesSchema);