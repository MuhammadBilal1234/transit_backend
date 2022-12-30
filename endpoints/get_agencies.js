/**
 * Created by lou_cifer on 14.01.17.
 */
var express = require('express');
var router = express.Router();
var agencies = require('../models/agencies');

/* GET home page. */
router.get('/', function (req, res, next) {

    agencies.find({userID: req.decoded._id},function (err, data) {
        if (err) {
            return res.json({success: false, message: err.stringify()});
        }

        return res.json({success: true, message: data});
    });
});

module.exports = router;
