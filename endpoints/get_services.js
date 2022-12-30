/**
 * Created by lou_cifer on 07.02.17.
 */

var express = require('express');
var router = express.Router();
var services = require('../models/services');
/* GET home page. */
router.post('/', function (req, res, next) {

    var userID = req.decoded._id;
    services.find({userID: userID},function (err, serv) {
        if(err) {
            console.log(err);
            return res.json({success: false, message: JSON.stringify(err)});
        }

        res.json({success: true, message: serv});

    })
});

module.exports = router;
