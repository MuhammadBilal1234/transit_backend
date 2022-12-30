var express = require('express');
var files = require('../models/stops');
var router = express.Router();

/* GET It is Working page. */

router.get('/', function(req, res, next) {
    files.find({},function (err, results) {
        results.forEach(function (element, index, array) {
            files.findOneAndUpdate({_id: element.id},{loc:{type: 'Point',coordinates: [ element.stop_lon, element.stop_lat]}},function(err){
                if (err) throw err;

            })
        })
    });

    res.render('index');

});

module.exports = router;
