/**
 * Created by lou_cifer on 14.01.17.
 */
var express = require("express");
var router = express.Router();
var stops = require("../models/stops");
const { v4: uuidv4 } = require("uuid");

/* GET home page. */
router.post("/", function (req, res, next) {
  debugger;
  var stop_data = req.body.stop;

  if (stop_data == "") {
    return res.json({
      success: false,
      message: "Missing obligatory parameters",
    });
  }
  stop_data.userID = req.user._id;
  stop_data.stop_id = uuidv4();

  var createNewStop = function (cb) {
    console.log(stop_data);
    var Stop = new stops(stop_data);
    Stop.save(function (err, data) {
      if (err) return cb(err, data);
      cb(null, true);
    });
  };

  if (stop_data._id && stop_data._id !== "") {
    delete stop_data.createdAt;
    delete stop_data.__v;
    stops.findOneAndUpdate(
      { _id: stop_data._id },
      stop_data,
      { upsert: true, new: true },
      function (err, data) {
        if (err) {
          return res.json({ success: false, message: err });
        }

        return res.json({ success: true, message: "Stop updated!" });
      }
    );
  } else {
    createNewStop(function (err, resolution) {
      if (err) {
        console.log(err);
        return res.json({ success: false, message: err });
      }

      res.json({ success: true, message: "New Stop is created!" });
    });
  }
});

module.exports = router;
