let express = require('express');
let router = express.Router();
let async = require('async');
var mongoose = require('mongoose');
let routes = require('../models/routes');



let ejs = require('ejs');

router.get('/', function (req, res) {
    routes.find({},function (err, routescount){
        if(!err){
            res.json({routes_count: routescount});
        }
    });

})
module.exports = router;
