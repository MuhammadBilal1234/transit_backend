/**
 * Class to provide all business services for routes CRUD operations.
 */

 var routes = require('../models/routes');
 var RouteNode = require('../models/nodes');
 var stops = require('../models/stops');
 var helper = require('../helpers/general_helper');
 
 
 module.exports = function RouteService(){

    this.GetRoute= function(routeID){

        var query = routes.find({routeID: routeID},"_id routeName routeID startRouteTime endRouteTime routeDesc "+
                                                    "routeLength totalTime frequency");        
        var result = query.exec().then(function(data){

            console.log("Data from Mongoose:"+data);                       
            return  AddNodesToRoute(data[0].toObject());;
        }).then(function(route){            
            return {success:true, message:route} 
        }).catch(function(err){
            console.log('error occured'+err);
            return {success:false, message:err};
        });
        return result;
    };

    function AddNodesToRoute(route){

        console.log("AddNodesToRoute called with route: "+route);
        if(!route || !route.routeID){
            console.info("AddNodesToRoute. Undefined route. Returning without adding any node"); 
            return;
        }
              
        return GetNodes(route.routeID).then(function(nodes){
            console.log("Successfully retreived nodes: "+nodes);
            var nodeObjects = [];
            nodes.forEach(node => nodeObjects.push(node.toObject()));
            route["nodes"] = nodeObjects;
            
            return AddStopsToNodes(route);
        }).then(function(route){            
            return route;
        });        
    }


    function GetNodes(routeID){

        console.log("GetNodes called with routeID: "+routeID);
        var query = RouteNode.find({routeID: routeID},null,{sort:{sequenceNo:1}}).exec();

        return query.then(function(nodes){
            console.log("GetNodee. Nodes returned from mongo:"+nodes);
           return nodes; 
        }).catch(function(err){
            console.log(err);
            throw err;
        });        
    }

    function AddStopsToNodes(route){

        console.log("AddStopsToNodes. Route: "+route);
        RouteNode = route.nodes;
        var stopIDs = RouteNode.map(function(node){return node.stopID;});
        var query = stops.find({stop_id:{$in: stopIDs }}).exec();

        return query.then(function(stops){
            console.log("AddStopsToNode. stops found for all nodes are: "+stops);
            RouteNode.forEach(node => {
                node["stop"] = stops.find(stop => stop.stop_id == node.stopID );
                console.log("stop: "+node["stop"]);                                
            });            
            return route;
        }).catch(function(err){
            console.error("route_service.GetStopes: "+err);
            throw err;
        });
    }
    
    this.SaveRoute= function(route){

        console.log("SaveRoute() called with route: "+helper.printObject(route));
        return getExistingRoute(route.routeID).then(function(existingRoute){
            return updateRoute(existingRoute, route);            
        }).then(function(updatedRoute){

            console.log("Updated Route: "+helper.printObject(updatedRoute));                   
            return updateNodes(route.nodes).then(function(updatedNodes){
                console.log("Updated nodes: "+ updatedNodes);
                updatedRoute= updatedRoute.toObject();
                updatedRoute.nodes = updatedNodes;
                return {success:true, message:updatedRoute};
            });                                                   
        }).catch(function(err){
            console.log(err);
            return {success:false, message:err};
        });                        
    };

    this.DeleteRoute = function(routeID){
        console.log('delete route called with '+routeID);
        return {success:true, message:'Routes has been deleted'};
    };

    function getExistingRoute(routeID)
    {
        return routes.findOne({routeID:routeID}).exec().then(function(route){                       
            return route;   
        });        
    }

    function updateRoute(existingRoute, routeRequest){
        if(existingRoute)
        {
            setRouteValues(existingRoute, routeRequest);
            return routes.updateOne({_id:existingRoute._id},existingRoute).exec().then(function(result){
                console.log("After updating route"+result);            
                return existingRoute;
            });
        }else{
            var newRoute =new routes(routeRequest);
            return newRoute.save().then(function(result){
                console.log("after saving new route"+result);
                return result;
            });
        }                     
    }

    function updateNodes(nodesToUpdate){        
        if(!nodesToUpdate) return nodesToUpdate;
        return RouteNode.saveAll(nodesToUpdate);        
    }

    function setRouteValues(route, routeRequest){
        
        route.routeName = routeRequest.routeName;
        route.startRouteTime = routeRequest.startRouteTime;
        route.endRouteTime = routeRequest.endRouteTime;
        route.routeDesc = routeRequest.routeDesc;
        route.routeLength = routeRequest.routeLength;
        route.totalTime = routeRequest.totalTime;
        route.frequency = routeRequest.frequency;
        route.serviceID = routeRequest.serviceID;
    }

    this.deleteRoute = function(routeID)
    {
        if(!routeID){
            return {success:false, message:"Invalid routeID provided"};
        }

        return routes.deleteOne({routeID: routeID}).then(deletedRoute => {
            return deletedRoute;
        }).then(function(deletedRoute){
            return RouteNode.deleteMany({routeID: routeID}).then(function(deletedNodes){
                console.log("deleted nodes: "+ helper.printObject(deletedNodes));
                return {success:true, message:"Route with route ID: "+ routeID+" deleted"}});
        }).catch(function(err){
            console.log(err);
            return {success:false, message:err};
        });
    }
 };