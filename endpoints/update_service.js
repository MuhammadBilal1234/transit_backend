/**
 * Created by lou_cifer on 20.02.17.
 */

var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var services = require("../models/services");
/* GET home page. */
router.post("/", function (req, res, next) {
  var userID = req.user._id;
  var service = req.body.service;
  if (service._id == null) {
    var newService = new services({
      service_id: service.service_id,
      friday: service.friday,
      monday: service.monday,
      saturday: service.saturday,
      sunday: service.sunday,
      thursday: service.thursday,
      tuesday: service.tuesday,
      wednesday: service.wednesday,
      end_date: service.end_date,
      serviceName: service.serviceName,
      start_date: service.start_date,
      userID: userID,
    });

    newService.save(function (err) {
      res.json({ success: true, message: "" });
    });
  } else {
    services.findOneAndUpdate(
      { userID: userID, _id: service._id },
      {
        service_id: service.service_id,
        friday: service.friday,
        monday: service.monday,
        saturday: service.saturday,
        sunday: service.sunday,
        thursday: service.thursday,
        tuesday: service.tuesday,
        wednesday: service.wednesday,
        end_date: service.end_date,
        serviceName: service.serviceName,
        start_date: service.start_date,
        userID: userID,
      },
      {
        upsert: false,
      },
      function (err, doc) {
        if (err) {
          console.log(err);
          return res.json({ success: false, message: JSON.stringify(err) });
        }

        res.json({ success: true, message: doc });
      }
    );
  }
});

module.exports = router;
