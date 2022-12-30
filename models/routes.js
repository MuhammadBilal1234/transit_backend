var mongoose = require("mongoose");
var timestamps = require("mongoose-timestamp");
var services = require("./services");
var agencies = require("./agencies");
mongoose.Promise = require("q").Promise;

var RoutesSchema = new mongoose.Schema(
  {
    userID: { type: String, index: true },
    route: Object,
    serviceID: [{ type: mongoose.Schema.Types.ObjectId, ref: "services" }],
    frequency: Array,
    routeName: String,
    routeID: String,
    startRouteTime: Object,
    routeDesc: String,
    routeLength: String,
    Total_time: String,
    Service_repeat: String,
    endRouteTime: Object,
    markerPoints: Array,
    usedStops: Array,
    // agency_id:[{ type: mongoose.Schema.Types.ObjectId, ref: 'agencies' }]
  },
  { collection: "real_routes" }
);

RoutesSchema.plugin(timestamps);
module.exports = mongoose.model("routes", RoutesSchema);
