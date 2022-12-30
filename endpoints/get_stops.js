/**
 * Created by lou_cifer on 14.01.17.
 */
var express = require("express");
var router = express.Router();
var stops = require("../models/stops");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const paginationOptions = {
    page: req.query.page,
    limit: 10,
  };

  try {
    const response = await stops.paginate(
      {
        userID: req.user._id,
      },
      paginationOptions
    );
    res.send(response);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
