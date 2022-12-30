/**
 * Created by lou_cifer on 07.02.17.
 */

var express = require("express");
var router = express.Router();
var services = require("../models/services");

/* GET home page. */
router.post("/", async function (req, res, next) {
  var userID = req.user._id;
  const paginationOptions = {
    page: req.query.page,
    limit: req.query.limit,
  };

  try {
    const response = await services.paginate(
      { userID: userID },
      paginationOptions
    );
    res.send(response);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
