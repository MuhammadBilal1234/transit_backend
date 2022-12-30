/**
 * Created by lou_cifer on 18.01.17.
 */
var express = require('express');
var router = express.Router();
var routes = require('../models/routes');

/* GET home page. */
router.post('/', function (req, res, next) {
    var _id = req.body.Object.id;
    routes.findById(_id,function (err, data) {
        if (err) {
            return res.json({success: false, message: err.stringify()});
        }

        return res.json({success: true, message: data});
    }).select({})
});

module.exports = router;
