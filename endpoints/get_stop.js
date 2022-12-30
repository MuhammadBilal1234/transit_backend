/**
 * Created by lou_cifer on 15.01.17.
 */
var express = require('express');
var router = express.Router();
var stops = require('../models/stops');

/* GET home page. */
router.post('/', function (req, res, next) {

    var _id = req.body.Object.ObjectId;
    debugger;
    if (_id == '') {
        return res.json({success: false, message: 'Missing obligatory parameters'});
    }

    stops.find({_id: _id}).exec(function(err, data) {
        if (!data) return res.json({success: false, message: 'Data not found for this Id.'});
            return res.json({success: true, message: data});
    })


});

module.exports = router;
