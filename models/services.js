var mongoose = require("mongoose");
var timestamps = require("mongoose-timestamp");
const mongoosePaginate = require("mongoose-paginate-v2");
mongoose.Promise = require("q").Promise;

var ServicesSchema = new mongoose.Schema(
  {
    userID: { type: String, index: true },
    monday: Boolean,
    tuesday: Boolean,
    wednesday: Boolean,
    thursday: Boolean,
    friday: Boolean,
    saturday: Boolean,
    sunday: Boolean,
    start_date: String,
    end_date: String,
    service_id: String,
    serviceName: { type: String, index: true },
  },
  { collection: "real_services" }
);
ServicesSchema.plugin(mongoosePaginate);
ServicesSchema.plugin(timestamps);
module.exports = mongoose.model("services", ServicesSchema);
