/**
 * Created by lou_cifer on 14.01.17.
 */
var express = require('express');
var router = express.Router();
var agencies = require('../models/agencies');

/* GET home page. */
router.post('/', function (req, res, next) {

    var agency_data = req.body.Object;



    if (agency_data == '' ) {
        return res.json({success: false, message: 'Missing obligatory parameters'});
    }
    agency_data.userID = req.decoded._id;

    var createNewAgency = function (cb) {
        var Agency = new agencies(agency_data);
        Agency.save(function (err) {
            if (err) return cb(err, data);

            cb(null, true);
        })

    };

    if (agency_data._id && agency_data._id !== '') {
        agencies.findOneAndUpdate({_id: agency_data._id}, agency_data, function (err, data) {
            if (err) {
                return res.json({success: false, message: err});
            }

           return res.json({success: true, message: 'Agency updated!'});
        })
    } else {
        createNewAgency(function (err, resolution) {
            if (err) {
                return res.json({success: false, message: err});
            }

            res.json({success: true, message: 'New agency was created!'});
        });
    }

});

module.exports = router;
