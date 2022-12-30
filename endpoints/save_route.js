/**
 * Created by lou_cifer on 14.01.17.
 */
var express = require("express");
var router = express.Router();
var routes = require("../models/routes");
var moment = require("moment");

router.post("/", (req, res) => {
  var route = req.body.Object.route;
  var frequency = req.body.Object.frequency;
  var routeID = req.body.Object.routeID;
  const _id = req.body.Object._id;
  var markerPoints = req.body.Object.markerPoints;
  var startRouteTime = req.body.Object.startRouteTime;
  var endRouteTime = req.body.Object.endRouteTime;
  var routeDesc = req.body.Object.routeDesc;
  var serviceID = req.body.Object.serviceID;
  var override = req.body.Object.override;
  var routeName = req.body.Object.routeName;
  const usedStops = req.body.Object.usedStops;
  var stop_time = [];
  const stoppage_time = { time: "60" };
  var routeDistance = 0;
  var formattedstartTime = `${startRouteTime.hour}:${startRouteTime.minute}:${startRouteTime.second}`;
  var startingTime = moment(formattedstartTime, "hh:mm:ss a");
  var formattedendTime = `${endRouteTime.hour}:${endRouteTime.minute}:${endRouteTime.second}`;
  var endingTime = moment(formattedendTime, "hh:mm:ss a");
  var totalRouteTime = endingTime.diff(startingTime, "minutes");
  var Service_repeat = (totalRouteTime / parseInt(frequency)).toFixed();

  console.log(req.user, formattedstartTime, formattedendTime);

  if (route == "" || startRouteTime == "" || serviceID == "") {
    return res.json({
      success: false,
      message: "Missing obligatory parameters",
    });
  }

  createNewRouteOrOverride = async (callback) => {
    if (!override) {
      for (var i = 0; i < route.length - 1; i++) {
        if (i == 0) {
          route[i]["arrival_time"] = moment(
            formattedstartTime,
            "hh:mm:ss"
          ).format("hh:mm:ss A");
          route[i]["departure_time"] = moment(
            formattedstartTime,
            "hh:mm:ss"
          ).format("hh:mm:ss A");
          stop_time.push(route[i]);
          var arrival_time = moment(formattedstartTime, "hh:mm:ss")
            .add(parseInt(route[i + 1].totaltime_insec), "seconds")
            .format("hh:mm:ss A");
          var departure_time = moment(formattedstartTime, "hh:mm:ss")
            .add(
              parseInt(route[i + 1].totaltime_insec) +
                parseInt(stoppage_time.time),
              "seconds"
            )
            .format("hh:mm:ss A");
          route[i + 1]["arrival_time"] = arrival_time;
          route[i + 1]["departure_time"] = departure_time;
          stop_time.push(route[i + 1]);
        } else {
          var arrival_time = moment(stop_time[i].departure_time, "hh:mm:ss A")
            .add(parseInt(route[i + 1].totaltime_insec), "seconds")
            .format("hh:mm:ss A");
          var departure_time = moment(stop_time[i].departure_time, "hh:mm:ss A")
            .add(
              parseInt(route[i + 1].totaltime_insec) +
                parseInt(stoppage_time.time),
              "seconds"
            )
            .format("hh:mm:ss A");
          route[i + 1]["arrival_time"] = arrival_time;
          route[i + 1]["departure_time"] = departure_time;
          stop_time.push(route[i + 1]);
        }
        routeDistance += parseInt(route[i + 1].total_distance);
      }
      var Length = (routeDistance / 1000).toFixed(3);
      var startTime = moment(stop_time[0].arrival_time, "hh:mm:ss a");
      var endTime = moment(
        stop_time[stop_time.length - 1].arrival_time,
        "hh:mm:ss a"
      );

      var TotalTime = endTime.diff(startTime, "minutes");

      var newRoute = new routes({
        userID: req.user._id,
        route: stop_time,
        serviceID: serviceID,
        routeName: routeName,
        routeID: routeID,
        frequency: frequency,
        startRouteTime: startRouteTime,
        routeDesc: routeDesc,
        routeLength: Length,
        Total_time: TotalTime,
        Service_repeat: Service_repeat,
        endRouteTime: endRouteTime,
        markerPoints,
        usedStops,
        // endRouteTime : route[route.length-1].arrival_time
        // agency_id : agency_id
        // stop_headsign:stop_headsign
      });

      newRoute
        .save()
        .then(function (result) {
          return callback(null, "Route saved successfully!");
        })
        .catch(function (err) {
          if (err) {
            return callback(err, null);
          }
        });
    } else {
      for (var i = 0; i < route.length - 1; i++) {
        if (i == 0) {
          route[i]["arrival_time"] = moment(
            formattedstartTime,
            "hh:mm:ss"
          ).format("LTS");
          route[i]["departure_time"] = moment(
            formattedstartTime,
            "hh:mm:ss"
          ).format("LTS");
          stop_time.push(route[i]);
          var arrival_time = moment(formattedstartTime, "hh:mm:ss")
            .add(parseInt(route[i + 1].totaltime_insec), "seconds")
            .format("LTS");
          var departure_time = moment(formattedstartTime, "hh:mm:ss")
            .add(
              parseInt(route[i + 1].totaltime_insec) +
                parseInt(stoppage_time.time),
              "seconds"
            )
            .format("LTS");
          route[i + 1]["arrival_time"] = arrival_time;
          route[i + 1]["departure_time"] = departure_time;
          stop_time.push(route[i + 1]);
        } else {
          var arrival_time = moment(stop_time[i].departure_time, "hh:mm:ss A")
            .add(parseInt(route[i + 1].totaltime_insec), "seconds")
            .format("LTS");
          var departure_time = moment(stop_time[i].departure_time, "hh:mm:ss A")
            .add(
              parseInt(route[i + 1].totaltime_insec) +
                parseInt(stoppage_time.time),
              "seconds"
            )
            .format("LTS");
          route[i + 1]["arrival_time"] = arrival_time;
          route[i + 1]["departure_time"] = departure_time;
          stop_time.push(route[i + 1]);
        }
        routeDistance += parseInt(route[i + 1].total_distance);
      }
      var Length = (routeDistance / 1000).toFixed(3);
      var startTime = moment(stop_time[0].arrival_time, "hh:mm:ss A");
      var endTime = moment(
        stop_time[stop_time.length - 1].arrival_time,
        "hh:mm:ss A"
      );

      var TotalTime = endTime.diff(startTime, "minutes");

      routes.updateOne(
        { _id: _id },
        {
          userID: req.user._id,
          route: stop_time,
          serviceID: serviceID,
          routeName: routeName,
          routeID: routeID,
          frequency: frequency,
          startRouteTime: startRouteTime,
          routeDesc: routeDesc,
          routeLength: Length,
          Total_time: TotalTime,
          Service_repeat: Service_repeat,
          endRouteTime: endRouteTime,
          markerPoints,
          usedStops,
          // agency_id : agency_id
          // stop_headsign: stop_headsign
        },
        { upsert: false },
        function (err, res) {
          if (err) {
            console.log(err);
            return callback(err, null);
          }
          return callback(null, "Route updated successfully!");
        }
      );
    }
  };
  createNewRouteOrOverride(function (err, resolution) {
    if (err) {
      return res.json({ success: false, message: err });
    }

    res.json({ success: true, message: resolution });
  });
});

module.exports = router;
