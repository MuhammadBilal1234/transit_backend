/**
 * Created by lou_cifer on 14.01.17.
 */
var express = require("express");
var router = express.Router();
var agencies = require("../models/agencies");

/* GET home page. */
router.post("/", async function (req, res, next) {
  var text = req.body.text;
  const userID = req.user._id;

  const allAgencyData = [];
  const agencyTextArr = text.split(/\r?\n/);
  const AgencyKeys = agencyTextArr[0].split(",");
  const AgencyValues = agencyTextArr.slice(1, agencyTextArr.length);

  // Split Keys

  AgencyValues.forEach((agen) => {
    const agencyArr = agen.split(",");
    let newAgency = {};
    for (let i = 0; i < AgencyKeys.length; i++) {
      newAgency[AgencyKeys[i]] = agencyArr[i];
    }
    newAgency.userID = userID;

    allAgencyData.push(newAgency);
  });

  try {
    const response = await agencies.insertMany(allAgencyData);
    res.send(response);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

module.exports = router;
