var express = require("express");
var router = express.Router();
var users = require("../models/users");
var authHelper = require("../helpers/auth_helper");
var emailHelper = require("../helpers/mail_helper");
var SHA256 = require("crypto-js/sha256");
var ejs = require("ejs");
var async = require("async");
var config = require("../config/config");

router.get("/", async function (req, res) {
  const id = req.query.id;

  console.log("id", id);

  if (id) {
    try {
      const user = await users.findOne({ _id: id });
      if (user) {
        return res.status(200).send(user);
      } else {
        return res.sendStatus(403);
      }
    } catch (error) {
      return res.send(error);
    }
  } else {
    return res.sendStatus(403);
  }
});

module.exports = router;
