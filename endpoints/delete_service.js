/**
 * Created by lou_cifer on 15.01.17.
 */
var express = require("express");
var router = express.Router();
var services = require("../models/services");

/* GET home page. */
router.post("/", function (req, res, next) {
  var _id = req.body.id;

  if (_id == "") {
    return res.json({
      success: false,
      message: "Missing obligatory parameters",
    });
  }

  services
    .findOne({ userID: req.user._id, _id: _id })
    .exec(function (err, data) {
      if (!data)
        return res.json({ success: false, message: "This route is missing!" });
      data.remove(function (err) {
        if (err) {
          console.log(err);
          return res.json({
            success: false,
            message: "Something went wrong..",
          });
        }

        return res.json({
          success: true,
          message: "Service has been removed successfully!",
        });
      });
    });
});

module.exports = router;
