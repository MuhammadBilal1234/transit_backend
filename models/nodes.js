var mongoose = require('mongoose');
var timestamp = require('mongoose-timestamp');
var Q = require('q');
var helper = require('../helpers/general_helper');

mongoose.Promise = Q.Promise;

var nodes = new mongoose.Schema({
    _id:{type:mongoose.Schema.Types.ObjectId, index:true,auto:true, required:true},
    routeID:{type:String,ref:'routes'},
    stopID: {type:Number, ref:'stops'},
    nextNode: {type:mongoose.Schema.Types.ObjectId},
    sequenceNo: Number
},{collection:"routes_nodes"});

nodes.plugin(timestamp);

nodes.statics.saveAll = function(nodesToUpdate){    
    if(!nodesToUpdate) return nodesToUpdate;
    console.log("inside saveAll"+helper.printObject(nodesToUpdate));
   
    return Q.all(nodesToUpdate.map(node => {        
        
        var routeNode = new RouteNode(node);        
        if(node._id){            
            return routeNode.update(routeNode).exec().then(function(updatedNodes){
                console.log("After updating node"+helper.printObject(updatedNodes));
                return routeNode;
            });
        }else{                        
            return routeNode.save().then(function(updatedNodes){
                console.log("After saving node"+helper.printObject(updatedNodes));
                return updatedNodes;
            });            
        }  
    })).then(function(updatedNodes){
        console.log("After loop"+helper.printObject(updatedNodes));
        return updatedNodes;
    }).catch(function(err){
        console.log(err);
        throw err;
    });
}

var RouteNode = mongoose.model('RouteNode',nodes);

module.exports =RouteNode;
