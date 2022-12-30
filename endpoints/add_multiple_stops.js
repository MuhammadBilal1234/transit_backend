/**
 * Created by lou_cifer on 14.01.17.
 */
var express = require("express");
var router = express.Router();
var stops = require("../models/stops");
const { v4: uuidv4 } = require("uuid");

/* GET home page. */
router.post("/", async function (req, res, next) {
  const text = req.body.text;
  const userID = req.user._id;

  const allStopsData = [];
  const stopTextArr = text.split(/\r?\n/);
  const StopsKeys = stopTextArr[0].split(",");
  const StopsValues = stopTextArr.slice(1, stopTextArr.length);

  // Split Keys

  StopsValues.forEach((stop) => {
    const stopArr = stop.split(",");
    let newStop = {};
    for (let i = 0; i < StopsKeys.length; i++) {
      newStop[StopsKeys[i]] = stopArr[i];
    }
    newStop.userID = userID;
    newStop.stop_lat = Number(newStop?.stop_lat);
    newStop.stop_lon = Number(newStop?.stop_lon);
    newStop.loc = {
      type: "Point",
      coordinates: [newStop.stop_lon, newStop.stop_lat],
    };
    allStopsData.push(newStop);
  });

  try {
    const response = await stops.insertMany(allStopsData);
    res.send(response);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

module.exports = router;
