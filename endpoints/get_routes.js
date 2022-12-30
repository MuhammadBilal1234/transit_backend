/**
 * Created by lou_cifer on 14.01.17.
 */
var express = require("express");
var router = express.Router();
var routes = require("../models/routes");

/* GET home page. */
router.get("/", function (req, res, next) {
  routes
    .find(
      { userID: req.user._id },
      "_id route routeName routeID routeLength Total_time frequency startRouteTime" +
        " endRouteTime routeDesc daysOfOperations",
      function (err, data) {
        if (err) {
          return res.json({ success: false, message: err.stringify() });
        }

        return res.json({ success: true, message: data });
      }
    )
    .select({});
});

module.exports = router;
