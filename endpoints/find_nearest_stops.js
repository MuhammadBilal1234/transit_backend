var express = require("express");
var stops = require("../models/stops");
var router = express.Router();

/* GET It is Working page. */

router.post("/", function (req, res, next) {
  var limit = parseInt(req.query.limit) || 3;
  console.log(req.body.usedStops);

  if (isNaN(parseInt(limit))) {
    limit = 3;
  }
  // get the max distance or set it to 8 kilometers
  var maxDistance = req.query.distance || 5;

  // we need to convert the distance to radians
  // the raduis of Earth is approximately 6371 kilometers
  maxDistance /= 6371;

  // get coordinates [ <longitude> , <latitude> ]
  var coords = [];
  coords[0] = req.query.lng;
  coords[1] = req.query.lat;
  console.log(coords);
  // find a location
  stops
    .find({
      _id: { $nin: req.body.usedStops },
      loc: {
        $near: {
          type: "Point",
          coordinates: coords,
        },
      },
      userID: req.user._id,
    })
    .limit(limit)
    .exec()
    .then(function (result) {
      res.json({ succcess: true, locations: result });
    })
    .catch(function (err) {
      if (err) {
        return res.json({ success: false, err: err });
      }
    });
});

module.exports = router;
