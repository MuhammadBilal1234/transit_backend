/**
 * Created by lou_cifer on 20.02.17.
 */

var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var services = require("../models/services");
/* GET home page. */
router.post("/", async function (req, res) {
  var userID = req.user._id;
  var text = req.body.text;

  const allCalenderData = [];
  const calenderTextArr = text.split(/\r?\n/);
  const calenderKeys = calenderTextArr[0].split(",");
  const calenderValues = calenderTextArr.slice(1, calenderTextArr.length);

  // Split Keys

  calenderValues.forEach((cal) => {
    const calArr = cal.split(",");
    let newCal = {};
    for (let i = 0; i < calenderKeys.length; i++) {
      newCal[calenderKeys[i]] = calArr[i];
    }
    newCal.userID = userID;
    allCalenderData.push(newCal);
  });

  try {
    const response = await services.insertMany(allCalenderData);
    res.send(response);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

module.exports = router;
