/**
 * Created by lou_cifer on 15.01.17.
 */
var express = require('express');
var router = express.Router();
var routes = require('../models/routes');

/* GET home page. */
router.post('/', function (req, res, next) {

    var routeID = req.body.Object.routeID;

    if (routeID == '') {
        return res.json({success: false, message: 'Missing obligatory parameters'});
    }

    routes.findOne({userID: req.decoded._id,routeID: routeID}).exec(function(err, data) {
        data.remove(function (err) {
            if(err){
                return res.json({success: false, message: 'Something went wrong..'});
            }

            return res.json({success: true, message: 'Route has been removed successfully!'});
        });

    })


});

module.exports = router;
