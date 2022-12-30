/**
 * Created by lou_cifer on 14.01.17.
 */
var express = require("express");
var router = express.Router();
var gtfsFiles = require("../models/files");

/* GET home page. */
router.get("/", function (req, res) {
  gtfsFiles.find({ userID: req.user._id }, function (err, data) {
    if (err) {
      return res.json({ success: false, data: err.stringify() });
    }

    return res.json({ success: true, data });
  });
});

module.exports = router;
