let express = require("express");
let router = express.Router();
let async = require("async");
var mongoose = require("mongoose");
let services = require("../models/services");
let agencies = require("../models/agencies");
let stops = require("../models/stops");
let routes = require("../models/routes");

let ejs = require("ejs");

router.get("/", function (req, res) {
  services.count(function (err, servicescount) {
    if (!err) {
      agencies.count(function (err, agencyCount) {
        if (!err) {
          stops.count(function (err, stopscount) {
            if (!err) {
              routes.count(function (err, routescount) {
                if (!err) {
                  res.json({
                    total_services: servicescount,
                    total_agency: agencyCount,
                    stops_count: stopscount,
                    routes_count: routescount,
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});
module.exports = router;
