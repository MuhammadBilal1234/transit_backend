/**
 * Service to provide routes nodes related operations i.e. CRUD
 */
var express = require('express');
var router = express.Router();
var nodes = require('../models/nodes');

router.get('/', function(req, res, next){
    return res.json({success:true, message :"Nodes default URL called"});
});

router.post("/createNode", function(req, res, next){
    var request = req.body;
    var routeID = request.routeID;
    var stopID = request.stopID;
    var sequenceNo = request.sequenceNo;
    
    var node = new nodes();
    node.stopID = stopID;
    node.routeID = routeID;
    node.sequenceNo = sequenceNo;
    node.nextNode = "Test Node";

    node.save();
    console.log(JSON.stringify(node));
    return res.json({success: true, message:node });
});

module.exports = router;