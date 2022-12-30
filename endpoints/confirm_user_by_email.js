var express = require("express");
var router = express.Router();
var users = require("../models/users");
router.post("/", function (req, res) {
  //VARIABLES METHODS
  var hash = req.body.hash;
  var userId = req.body.userId;

  if (hash == "" || userId == "") {
    return res.json({
      success: false,
      message: "Missing obligatory parameters",
    });
  }

  users.findOneAndUpdate(
    { _id: userId, confHash: hash, confirmed: false },
    { confirmed: true, confHash: undefined },
    {},
    function (err, result) {
      if (err) {
        return res.json({ success: false, message: err.stringify() });
      }

      if (!result) {
        return res.json({
          success: false,
          message:
            "We could not confirm your email. Perhaps it was already" +
            " confirmed?",
        });
      }

      res.json({
        success: true,
        message:
          "Congratulations, your email was confirmed, you may login now.",
      });
    }
  );
});

module.exports = router;
