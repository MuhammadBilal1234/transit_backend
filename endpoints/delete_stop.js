/**
 * Created by lou_cifer on 15.01.17.
 */
var express = require("express");
var router = express.Router();
var stops = require("../models/stops");

/* GET home page. */
router.post("/", async function (req, res, next) {
  var stopId = req.body.id;

  if (stopId == "") {
    return res.json({
      success: false,
      message: "Missing obligatory parameters",
    });
  }

  try {
    console.log(req.user._id, stopId);
    const deletedStop = await stops.deleteOne({
      userID: req.user._id,
      _id: stopId,
    });
    res.send(deletedStop);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }

  // stops
  //   .findOne({ userID: req.user._id, _id: stopId })
  //   .exec(function (err, data) {
  //     console.log(data);
  //     if (!data)
  //       return res.json({ success: false, message: "This stop is missing" });
  //     data.remove(function (err) {
  //       if (err) {
  //         return res.json({
  //           success: false,
  //           message: "Something went wrong..",
  //         });
  //       }

  //       return res.json({
  //         success: true,
  //         message: "Stop has been deleted successfully!",
  //       });
  //     });
  //   });
});

module.exports = router;
