var express = require("express");
var router = express.Router();
var users = require("../models/users");
var bcrypt = require("bcrypt");
var authHelper = require("../helpers/auth_helper");
var { generateToken } = require("../helpers/auth");

router.post("/", function (req, res) {
  //VARIABLES METHODS

  var email = req.body.email;
  var password = req.body.password;

  if (email == "" || password == "") {
    return res.json({
      success: false,
      message: "Missing obligatory parameters",
    });
  }
  var isCredentialsCorrect = function (email, password, callback) {
    users.getUserByEmail(email, function (err, result) {
      if (err) {
        return callback(err, null);
      }

      if (result) {
        bcrypt.compare(password, result.password, async function (err, res) {
          if (err) {
            return callback(err, null);
            console.log("Here 12 Error<><>");
          }

          if (res) {
            result.password = undefined; //clear password - nobody need to see it really..
            const token = await generateToken(result);
            result.token = token;
            return callback(null, result);
            authHelper.makeToken(result, function (token) {
              authHelper.saveMemcached(token, result, function () {
                console.log("Here 123 MEME Success<><>");
              });
            });
          } else {
            callback(null, false);
          }
        });
      } else {
        callback(null, false);
      }
    });
  };

  //ACTUAL LOGIC

  isCredentialsCorrect(email, password, function (err, result) {
    console.log("err", err);
    console.log("result", result);
    if (err) {
      res.json({ success: false, message: err });
    }

    if (result) {
      var token = result.token;
      result.token = undefined;
      res.status(200).json({
        success: true,
        message: "Authentication successful!",
        data: result,
        token: token,
      });
    } else {
      res.status(409).json({
        success: false,
        message: "User is missing or email was not approved yet.",
      });
    }
  });
});

module.exports = router;
