let express = require('express');
let router = express.Router();
let fs = require('fs');
let async = require('async');
let moment = require('moment');
let authHelper = require('../helpers/auth_helper');
let SHA256 = require("crypto-js/sha256");
let files = require('../models/files');
let stops = require('../models/stops');
let gtfsCalendar = require('../models/gtfs_calendar');
let gtfsStopTimes = require('../models/gtfs_stop_times');
let ejs = require('ejs');
router.get('/', function (req, res, next) {


    let time = req.query.time;
    let date = new Date(req.query.date);
    let userID = req.query.user_id;
    let routeID = req.query.route_id;
    let calendarServices = null;
    let allStops = null;
    let stopNames = [];

    let serviceIDsArray = [];
    let stopsSorted = null;

    if ((!!!time) || (!!!date) || (!!!userID) || (!!!routeID)) {
        return res.render('display_timetable', {
            error: 'Missing obligatory params!',
            date: moment().format("dddd, MMMM Do YYYY")
        });
    }

    let visitURI = SHA256(req.get('host') + req.originalUrl).toString();

    let dayOfTheWeek = moment(date).format('dddd').toLowerCase();


    let checkMemcached = function (callback) {
        authHelper.memcachedGetUrl(visitURI, function (err, data) {

            if (err) return callback(err, null);

            if (data) {
                return printData(data);
            }

            callback(null, true);


        })
    };

    let getStops = function (callback) {
        stops.find({userID: userID}, function (err, stopData) {
            if (err) return callback(err, null);

            if (stopData.length === 0) return callback('There is no stops defined for this User!', null);
            allStops = stopData;
            callback(null, stopData);
        })
    };

    let returnServicesInvolved = function (callback) {
        let searchQuery = {$and: [{userID: userID}, {createGtfsTime: time}, {start_date: {$lte: date}}, {end_date: {$gte: date}}]};
        searchQuery[dayOfTheWeek] = true;

        gtfsCalendar.find(searchQuery, function (err, calendars) {
            if (err) return callback(err, null);

            if (calendars.length === 0) return callback('No routes for the selected date!', null);
            calendars.forEach(function (element) {
                serviceIDsArray.push(element.service_id);
            });
            console.log('serviceIDsArray',serviceIDsArray);
            calendarServices = calendars;
            callback(null, calendars)


        })
    };

    let returnStopNameById = function (stopId) {
        let answer = null;
        allStops.forEach(function (element) {
            if (element.stop_id === parseInt(stopId, 10)) {

                answer = element.stop_name;
            }
        });

        return answer;
    };

    let returnStopTimes = function (callback) {
        let query = [];
        serviceIDsArray.forEach(function (el, ind) {
            query.push(el);
        });
        console.log('query',query);
        let finalQuery = {
            route_id: routeID,
            service_id: {$in: query},
            createGtfsTime: time
        };

        console.log(JSON.stringify(finalQuery));
        gtfsStopTimes.find(finalQuery).sort('stopTime').exec(function (err, docs) {
            if (err) return callback(err, null);

            if (docs.length === 0) return callback('No routes for the selected date!', null);

            stopsSorted = docs.map(function (doc) {
                return JSON.parse(JSON.stringify(doc))
            });
            stopsSorted.forEach(function (element, index) {
                let stopName = returnStopNameById(element.stop_id);
                stopNames[stopName] = [];
                stopsSorted[index].stopName = stopName;
            });


            stopsSorted.forEach(function (element) {

                stopNames[element.stopName].push(element);
            });


            callback(null, docs);
        })
    };

    let printData = function (data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': data.length,
            'Expires': new Date().toUTCString()
        });

        return res.end(data);
    };

    let htmlTemplate = function (callback) {
        ejs.renderFile('./views/display_timetable.ejs',
            {
                error: null,
                date: moment(date).format("dddd, MMMM Do YYYY"),
                stopsSorted: stopsSorted,
                stopNames: stopNames,
                routeID: routeID
            }, {}, function (err, html) {
                if (err) {
                    console.log(err);
                    return callback(err, null);
                }

                authHelper.memcachedSetUrl(visitURI, html, function (err) {
                    console.log('authHelper.memcachedSetUrl');
                    if (err) console.log(err);

                    printData(html);


                });
            });
    };


    async.series([
            checkMemcached,
            getStops,
            returnServicesInvolved,
            returnStopTimes
        ],
        function (err) {

            if (err) {
                if (typeof err !== "string") {
                    err = JSON.stringify(err);
                    console.log('ERRRRRR');
                }
                console.log('date:',date);
                return res.render('display_timetable', {error: err, date: moment(date).format("dddd, MMMM Do YYYY")});

            }


            htmlTemplate(function (err, html) {
            });

        }
    );


});

module.exports = router;
