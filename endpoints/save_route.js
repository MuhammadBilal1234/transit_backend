/**
 * Created by lou_cifer on 14.01.17.
 */
var express = require('express');
var router = express.Router();
var routes = require('../models/routes');

/* GET home page. */
router.post('/', function (req, res, next) {

    var route = req.body.Object.route;
    var routeName = req.body.Object.routeName;
    var frequency = req.body.Object.frequency;
    var routeID = req.body.Object.routeID;
    var startRouteTime = req.body.Object.startRouteTime;
    var endRouteTime = req.body.Object.endRouteTime;
    var routeDesc = req.body.Object.routeDesc;
    var serviceID = req.body.Object.serviceID;
    var totalTime = req.body.Object.totalTime;
    var routeLength = req.body.Object.routeLength;
    var override = req.body.Object.override;

    if (route == '' || routeName == '' || routeID == '' || startRouteTime == '' || endRouteTime == '' || frequency == '' || serviceID == '') {
        return res.json({success: false, message: 'Missing obligatory parameters'});
    }

    createNewRouteOrOverride = function (cb) {
        if (!override) {
            routes.find({routeID: routeID},function (err, resp) {
                if (err) {
                    return cb(err.stringify(), null);
                }

                if (resp.length > 0) {
                   return cb('Route with this ID already exist, try to change the ID please!');
                }

                var newRoute = new routes({
                    userID: req.decoded._id,
                    route: route,
                    serviceID: serviceID,
                    routeName: routeName,
                    routeID: routeID,
                    frequency: frequency,
                    startRouteTime: startRouteTime,
                    endRouteTime: endRouteTime,
                    routeDesc: routeDesc,
                    routeLength: routeLength,
                    totalTime: totalTime
                });

                newRoute.save()
                    .then(function (result) {

                        return cb(null, 'Route saved successfully!');
                    })
                    .catch(function (err) {
                        if (err) {
                            return cb(err.stringify(), null);
                        }
                    });
            })
        } else {//overriding here:

            routes.update({routeID: routeID},{
                userID: req.decoded._id,
                route: route,
                serviceID: serviceID,
                routeName: routeName,
                routeID: routeID,
                frequency: frequency,
                startRouteTime: startRouteTime,
                endRouteTime: endRouteTime,
                routeDesc: routeDesc,
                routeLength: routeLength,
                totalTime: totalTime
            },{upsert:false},function (err, res) {
                if (err) {
                    console.log(err);
                    return cb(err.stringify(), null);
                }
                return cb(null, 'Route updated successfully!');

            } )

        }

    };

    createNewRouteOrOverride(function (err, resolution) {
        if (err) {
            return res.json({success: false, message: err});
        }

        res.json({success: true, message: resolution});
    });
    //res.json({success: true, message: 'Route saved successfully!'});
});

module.exports = router;
