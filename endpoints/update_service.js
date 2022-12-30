/**
 * Created by lou_cifer on 20.02.17.
 */

var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var services = require('../models/services');
/* GET home page. */
router.post('/', function (req, res, next) {

    var userID = req.decoded._id;
    var service = req.body.Object;
    if (service._id == null) {
        var newService = new services({
            Fryday: service.Fryday,
            Monday: service.Monday,
            Saturday: service.Saturday,
            Sunday: service.Sunday,
            Thursday: service.Thursday,
            Tuesday: service.Tuesday,
            Wednesday: service.Wednesday,
            endDate: service.endDate,
            serviceName: service.serviceName,
            startDate: service.startDate,
            userID: userID
        });
        
        newService.save(function (err) {
            res.json({success: true, message: ''});
        })

    } else {
        services.findOneAndUpdate({userID: userID, _id: service._id}, {
            Fryday: service.Fryday,
            Monday: service.Monday,
            Saturday: service.Saturday,
            Sunday: service.Sunday,
            Thursday: service.Thursday,
            Tuesday: service.Tuesday,
            Wednesday: service.Wednesday,
            endDate: service.endDate,
            serviceName: service.serviceName,
            startDate: service.startDate,
            userID: userID
        }, {
            upsert: false

        }, function (err, doc) {
            if(err) {
                console.log(err);
                return res.json({success: false, message: JSON.stringify(err)});
            }

            res.json({success: true, message: doc});
        });
    }

});

module.exports = router;

