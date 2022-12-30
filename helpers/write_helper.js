/**
 * Created by lou_cifer on 11.02.17.
 */
var fs = require('fs');
var zip = require('node-native-zip');
var mkdirp = require('mkdirp');
var path = __dirname + '/downloads/';
var rimraf = require('rimraf');
var moment = require('moment');
var siteConfig = require('../config/config');
var startDayPattern = '2017-01-01';
var gtfsStopTimes = require('../models/gtfs_stop_times');
var distance = require('google-distance');
distance.apiKey= 'AIzaSyBVDV2D0rSI4fOW_y_Gfor0Ejz_df-YC1M';
const MISSING_FILE_ERROR = -2;

var writeHelper = {
    writeFile: function (userID, userTime, fileName, content, callback) {
        var dirPath = path + userID + '/' + userTime;
        mkdirp(dirPath, function (err) {
            if (err) {
                return callback(err, null);
            }
            var filePath = dirPath + '/' + fileName;

            fs.writeFile(filePath, content, function (err) {
                if (err) {
                    return callback(err, null);
                }

                return callback(null, 'File was saved');
            });

        });

    },
    getFileContent: function (fileName, userID, userTime ,  cb) {
        var filePath = path + userID + '/' + userTime + '/' + fileName;
        fs.stat(filePath, function (err, stats) {

            if (err && err.errno !== MISSING_FILE_ERROR) return cb(err, null);

            if (err && err.errno === MISSING_FILE_ERROR) return cb(null, '');

            if (stats.isFile()) {
                fs.readFile(filePath, 'utf8', function (err, data) {
                    if (err) return cb(err, null);
                    console.log("file read successfull");

                    cb(null, data);
                });

            } else {
                console.log("file read not successfull");

                cb(null, '');
            }
        });
    },
    deleteDownloadFolder: function (userID,userTime, cb) {
        var dirPath = path + userID + '/' + userTime;
        rimraf(dirPath, function (er) {
            if (er) return cb(err, null);

            return cb(null, true);


        });
    },
    createShapesSequence: function (userID,userTime, allRoutes, cb) {
        var routeCount = allRoutes.length;
        writeHelper.getFileContent('shapes.txt', userID, userTime, function (err, content) {
            if (content === '') {
                content = 'shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence,shape_dist_traveled' + "\n";
            }
            if(routeCount>0){
            allRoutes.forEach(function (element, index, array) {
                if (err) {
                    return cb(err, null);
                } else {

                    Array.prototype.forEach.call(element.route,function (rElement, rIndex, rArray) {
                        content += 'Route_' + element.routeID + ',' + rElement.stop_lat + ',' + rElement.stop_lon + ',' + parseInt(rIndex + 1, 10) + ',' + "\n";
                    });

                    if ((routeCount - 1) == index) {
                        writeHelper.writeFile(userID, userTime, 'shapes.txt', content, function (err, res) {
                            if (err) {
                                return cb(err, null);
                            }

                            cb(null, 'File was saved');

                        });
                    }
                }
            });
        }
        });
    },
    createStopTimeFile: function (userID, userTime, allRoutes, cb) {
        // var routeCount = allRoutes.length;
        var minToSeconds = 60*1000;
        var availableRoutesFrequencies = [];
        var availableRoutesStartTime = [];
        var availableRoutesEndTime = [];
        var frequencyIncrementer = null;
        var tourIndex = 0;
        var stops = [];
        var previousDistanceSoFar = null;
        var distanceBetweenStops = 0;
        var middleTime = 0;
        var previousMiddleTime = 0;
        var previousAvgSpeedAfterThis = null;
        var contentTrips = 'route_id,service_id,trip_id,trip_headsign,direction_id,block_id,shape_id' + "\n";
        writeHelper.getFileContent('stop_times.txt', userID,userTime, function (err, content) {
            if (content === '') {
                content = 'trip_id,arrival_time,departure_time,stop_id,stop_sequence,stop_headsign,pickup_type,drop_off_type,shape_dist_traveled' + "\n";
            }

            Array.prototype.forEach.call(allRoutes,function (element, index, array) {
                Array.prototype.forEach.call(element.serviceID,function (servElement, servIndex) {

                stops = [];

                if (err)  return cb(err, null);
                availableRoutesFrequencies = [];

                // element.frequency.forEach(function (felement, findex, farray) {

                //         availableRoutesFrequencies[findex] = {fr: null, time:null};
                //         availableRoutesFrequencies[findex].fr = parseInt(felement.fr, 10) * minToSeconds;
                //         availableRoutesFrequencies[findex].time = +new Date(moment(startDayPattern + felement.fromHr + ':' + element.startRouteTime.fromMin,siteConfig.fullDatePattern).format())
                //     });
                // availableRoutesStartTime[0] = +new Date(moment(startDayPattern + element.startRouteTime.startHr + ':' + element.startRouteTime.startMin,siteConfig.fullDatePattern).format());
                // console.log(availableRoutesStartTime[0]);
                // availableRoutesEndTime[0] = +new Date(moment(startDayPattern + element.endRouteTime.startHr + ':' + element.endRouteTime.startMin,siteConfig.fullDatePattern).format());
                // frequencyIncrementer = availableRoutesFrequencies[0].fr;
                tourIndex = 1;

                element.route.forEach(function (rElement, rIndex, rArray) {
                       stops.push(rElement);
                });
                
                        for(var i=0;i<stops.length;i++){

                            content += element.routeID + servElement.serviceName + '_tour_' + tourIndex + ',' + stops[i].arrival_time + ',' + stops[i].departure_time + ',' + stops[i].stop_id + ',' + parseInt(i + 1, 10)  + ',' + element.stop_headsign+',0,0,' + "\n";
                            let newStopTimes = new gtfsStopTimes(
                                {
                                    userID: userID,
                                    createGtfsTime: userTime,
                                    service_id: servElement.serviceName,
                                    route_id: element.routeID,
                                    // stopTime: new Date(),
                                    trip_id: element.routeID + servElement.serviceName + '_tour_' + tourIndex,
                                    arrival_time: stops[i].arrival_time,
                                    departure_time: stops[i].departure_time,
                                    stop_id: stops[i].stop_id,
                                    stop_sequence: parseInt(i + 1, 10),
                                    stop_headsign: element.stop_headsign,
                                    pickup_type: '0',
                                    drop_off_type: '0',
                                    frequency:element.frequency[0],
                                    Service_repeat: parseInt(element.Service_repeat)
                                    // shape_dist_traveled: element.routeLength
                                }
                            );

                            newStopTimes.save(function (err) {

                            });
                            // previousMiddleTime += middleTime;


                    contentTrips += element.routeID + ',' + servElement.serviceName + ',' + element.routeID + servElement.serviceName + '_tour_' + tourIndex + ',,1,,' +  'Route_' + element.routeID + "\n";



                    tourIndex++;

                    // availableRoutesFrequencies.forEach(function (freqelement, freqIndex, freqArray) {
                    //    if (freqelement.time < currentTime) {
                    //        frequencyIncrementer = freqelement.fr;
                    //    }
                    // });

                }





            });
            });
            writeHelper.writeFile(userID, userTime, 'stop_times.txt' , content, function (err, res) {
                if (err) {
                    console.log(err);
                    return cb(err, null);
                }
                // console.log(res,content);

                writeHelper.addLineToTripsFile(userID,userTime, contentTrips,function(err){
                    if (err) {
                        console.log(err);
                        return cb(err, null);
                    }
                    cb(null, 'File was saved');
                });



            });

        });
    },

    addLineToTripsFile: function (userID, userTime, content, callback) {

         writeHelper.writeFile(userID,userTime, 'trips.txt', content, function (err, res) {
                if (err) {
                    console.log(err);
                    return callback(err, null);
                }

                callback(null, 'File was saved');

            });
    },

    createZIP: function (userID,userTime, callback) {
        var archive = new zip();


        var path = __dirname + '/downloads/';
        var dirPath = path + userID + '/' + userTime + '/';

        //var dirPath = path+ '5b3d138d6c9013733990ef7d/1551798083509/';


        archive.addFiles([
            {name: "agency.txt", path: dirPath + "agency.txt"},
            {name: "calendar.txt", path: dirPath + "calendar.txt"},
            {name: "calendar_dates.txt", path: dirPath + "calendar_dates.txt"},
            {name: "fare_attributes.txt", path: dirPath + "fare_attributes.txt"},
            {name: "fare_rules.txt", path: dirPath + "fare_rules.txt"},
            {name: "feed_info.txt", path: dirPath + "feed_info.txt"},
            {name: "frequencies.txt", path: dirPath + "frequencies.txt"},
            {name: "routes.txt", path: dirPath + "routes.txt"},
            {name: "stops.txt", path: dirPath + "stops.txt"},
            {name: "shapes.txt", path: dirPath + "shapes.txt"},
            {name: "stop_times.txt", path: dirPath + "stop_times.txt"},
            {name: "trips.txt", path: dirPath + "trips.txt"}
        ], function (err) {
            if (err) {
                return callback(err, null);
            }

            var buff = archive.toBuffer();

            fs.writeFile(dirPath + "download.zip", buff, function (err) {
                if (err) {
                    return callback(err, null);
                }
                callback(null, 'ok');
            });
        });


    }
};

module.exports = writeHelper;

