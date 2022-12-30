/**
 * Created by lou_cifer on 14.01.17.
 */
var express = require('express');
var router = express.Router();
var routes = require('../models/routes');
var routeService = require('../services/route_service');

/* GET home page. */
router.get('/', function (req, res, next) {

    routes.find({userID: req.decoded._id},'_id routeName routeID routeLength totalTime frequency startRouteTime' +
        ' endRouteTime routeDesc daysOfOperations',function (err, data) {
        if (err) {
            return res.json({success: false, message: err.stringify()});
        }

        return res.json({success: true, message: data});
    }).select({})
});

router.get('/getRoute', function(req,res,next){

    var routeID = req.query.routeID;
    console.log('/getroute called with routeID'+routeID);
    var serverPromise = new routeService().GetRoute(routeID);

    serverPromise.then(function(result){
        console.log("service response message: "+JSON.stringify(result.message));
        console.log("service response status: "+result.success);
        return res.send(result);
    });        
});

/**
 * Save(add/update) complete route object. Validation was done in the service
 */
router.post('/saveRoute', function(req, res, next){
    new routeService().SaveRoute(req.body).then(function(result){
        console.log("/saveRoute. Result returned by service: "+ result.success);        
        return res.status(200).send(result);
    });   
});

router.post('/deleteRoute', function(req,res,next){
    new routeService().deleteRoute(req.query.routeID).then(function(result){
        console.log("/deleteRoute. Result returned by service"+ result.success);
        return res.status(200).send(result);
    });
});

module.exports = router;
