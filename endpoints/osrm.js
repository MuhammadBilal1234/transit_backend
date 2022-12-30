var express = require("express");
var router = express.Router();
var Request = require("request");

router.post("/", (req, res, next) => {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  var route_data = req.body.route;
  // https://osrm.transitmov.com/route/v1/driving/13.388860,52.517037;13.397634,52.529407;13.428555,52.523219?overview=false
  const url = `https://osrm5.technologymaze.com/viaroute?compression=false&loc=${route_data.lat1}%2C${route_data.lng1}&loc=${route_data.lat2}%2C${route_data.lng2}`;
  const url1 = `https://osrm.transitmov.com/route/v1/driving/${route_data.lng1},${route_data.lat1};${route_data.lng2},${route_data.lat2}?steps=true`;
  console.log(url1);
  drawRoute = (callback) => {
    Request.get(
      `http://osrm.transitmov.com/viaroute?compression=false&loc=${route_data.lat1}%2C${route_data.lng1}&loc=${route_data.lat2}%2C${route_data.lng2}`,
      (error, response, body) => {
        if (error) {
          return console.dir(error);
        }
        callback(null, JSON.parse(body));
      }
    );
  };
  drawRoute(function (error, resp) {
    return res.json({ success: true, data: resp });
  });
});
module.exports = router;
