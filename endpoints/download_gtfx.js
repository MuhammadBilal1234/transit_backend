/**
 * Created by lou_cifer on 07.02.17.
 */

const express = require("express");
const router = express.Router();
const routes = require("../models/routes");
const services = require("../models/services");
const auth_helper = require("../helpers/auth_helper");
const fileHelper = require("../helpers/write_helper");
const agencies = require("../models/agencies");
const file_system = require("fs");
const archiver = require("archiver");
const path = require("path");
const mime = require("mime");
const fs = require("fs");
const stops = require("../models/stops");
const async = require("async");
const moment = require("moment");
const gtfsFiles = require("../models/files");
const exec = require("child_process").exec;
const siteConfig = require("../config/config");
const gtfsCalendarModel = require("../models/gtfs_calendar");

/* GET home page. */
router.get("/", function (req, res, next) {
  let userTime = +new Date();
  let minToSeconds = 60 * 1000;
  //   let token = req.query.token;
  console.log("gtfx <>", req.query._id);
  var userID = req.query._id;
  var allRoutes = [];
  let allRoutesArray = [];
  let agencyId = null;
  let aRoutes = [];
  let availableRoutesIndex = 0;
  let availableRoutesFrequencies = [];
  let availableRoutesStartTime = [];
  let availableRoutesEndTime = [];
  let startDayPattern = "2017-01-01";
  let config = "";
  let activeDate = "";
  let mapBoxToken = siteConfig.mapBoxToken;
  const today =
    moment().format("YYYYMMDD-") + moment().add(1, "days").format("YYYYMMDD");
  let resultPath = "";
  let outputFiles = [];

  //memcachedGetUser
  // if (token == '' || token == null) {
  //     return res.send('<h1>This action is not allowed!</h1>');
  // }

  // let getUserID = function (callback) {
  //     auth_helper.memcachedGetUser(token, function (err, result) {
  //         if (err) {

  //             return callback(JSON.stringify(err), null);

  //         }

  //         if (!result) {
  //             return callback('<h1>This action is not allowed!</h1>', null);

  //         }

  //         userID = result._id;
  //         callback(null, true);
  //     });
  // };

  let getAllRoutes = function (callback) {
    allRoutes = routes
      .find({ userID: userID })
      .populate("serviceID")
      .exec(function (err, routs) {
        if (err) {
          return callback(JSON.stringify(err), null);
        }
        if (routs.length === 0) {
          return callback("<h1>No available routes!</h1>", null);
        }
        allRoutes = routs;
        callback(null, allRoutes);
      });
  };

  let createFile = function (content, name, callback) {
    fileHelper.writeFile(
      userID,
      userTime,
      name,
      content,
      function (err, resultat) {
        if (err) {
          return callback(JSON.stringify(err), null);
        }
        callback(null, true);
      }
    );
  };

  let saveGTFSinDatabase = (callback) => {
    let newFile = new gtfsFiles({
      userID: userID,
      time: userTime,
      files: outputFiles,
      routes: allRoutesArray,
    });

    newFile.save(function (err) {
      if (err) return callback(err, null);

      resultPath = `./html/${agencyId}/${today}`;

      callback(null, "OK");
    });
  };

  // let readDir = (callback) => {
  //     let resultPath = `./html/${agencyId}/${today}`;
  //     fs.readdir(resultPath, (err, files) => {
  //         if (err) return callback(err, null);
  //         files.forEach(file => {
  //             outputFiles.push({name:file,path: resultPath.replace('./html/','') + '/' + file});
  //             console.log(file);
  //         });
  //
  //         callback(null, 'ok');
  //     })
  // };

  let writeConfig = (callback) => {
    let config = `{
    "mongoUrl": "mongodb://localhost:27017/gtfs",
    "agencies": [
        {
            "agency_key": "${agencyId}",
            "path": "./helpers/downloads/${userID}/${userTime}"
        }
    ],
    "verbose": false,
    "effectiveDate": "${activeDate}",
    "noServiceSymbol": "—",
    "requestStopSymbol": "***",
    "showMap": true,
    "showOnlyTimepoint": true,
    "showStopCity": false,
    "mapboxAccessToken": "${mapBoxToken}",
    "zipOutput": false
}`;

    fs.writeFile(
      `./helpers/downloads/${userID}/config.json`,
      config,
      function (err) {
        if (err) {
          return callback(err, null);
        }

        return callback(null, "ok");
      }
    );
  };

  let createAgenciesFile = function (callback) {
    agencies.findOne({ userID: userID }, function (err, agn) {
      if (err) {
        return callback(JSON.stringify(err), null);
      }
      let content =
        "agency_id,agency_name,agency_url,agency_timezone,agency_lang,agency_phone,agency_fare_url" +
        "\n";
      content +=
        agn?.agency_id +
        "," +
        agn?.agency_name +
        "," +
        agn?.agency_url +
        "," +
        agn?.agency_timezone +
        "," +
        agn?.agency_lang +
        "," +
        agn?.agency_phone +
        "," +
        agn?.agency_fare_url +
        "\n";
      createFile(content, "agency.txt", function (err, result) {
        if (err) {
          return callback(err, null);
        }

        agencyId = agn?.agency_id;
        callback(null, true);
      });
    });
  };

  let createFareRulesFile = function (callback) {
    let content =
      "fare_id,route_id,origin_id,destination_id,contains_id" + "\n";

    createFile(content, "fare_rules.txt", function (err, result) {
      if (err) {
        return callback(err, null);
      }
      callback(null, true);
    });
  };

  let createFareAttributesFile = function (callback) {
    let content =
      "fare_id,price,currency_type,payment_method,transfers,transfer_duration" +
      "\n";

    createFile(content, "fare_attributes.txt", function (err, result) {
      if (err) {
        return callback(err, null);
      }
      callback(null, true);
    });
  };

  let createFeedInfoFile = function (callback) {
    let content =
      "feed_publisher_name,feed_publisher_url,feed_lang,feed_version" +
      "\n" +
      "Mowasalat,http://eng.mowasalat.com,en,Version 20-03-2012" +
      "\n";

    createFile(content, "feed_info.txt", function (err, result) {
      if (err) {
        return callback(err, null);
      }
      callback(null, true);
    });
  };

  let createCalendarDatesFile = function (callback) {
    let content = "service_id,date,exception_type" + "\n";

    createFile(content, "calendar_dates.txt", function (err, result) {
      if (err) {
        return callback(err, null);
      }
      callback(null, true);
    });
  };

  let createFrequenciesFile = function (callback) {
    let content = "trip_id,start_time,end_time,headway_secs" + "\n";

    createFile(content, "frequencies.txt", function (err, result) {
      if (err) {
        return callback(err, null);
      }
      callback(null, true);
    });
  };

  let convert = function (dateString) {
    console.log("Date String <><><>", dateString);
    let year = dateString.substr(0, 4);
    let month = dateString.substr(5, 2); //20120101
    let day = dateString.substr(8, 2);
    return new Date(year, month, day);
  };

  let createCalendarFile = function (callback) {
    services.find({ userID: userID }, function (err, rez) {
      if (err) {
        return callback(JSON.stringify(err), null);
      }

      let content =
        "service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date" +
        "\n";
      rez.forEach(function (agn) {
        content +=
          agn.service_id +
          "," +
          +agn.monday +
          "," +
          +agn.tuesday +
          "," +
          +agn.wednesday +
          "," +
          +agn.thursday +
          "," +
          +agn.friday +
          "," +
          +agn.saturday +
          "," +
          +agn.sunday +
          "," +
          agn.start_date +
          "," +
          agn.end_date +
          "\n";
        var newCalendarRecord = new gtfsCalendarModel({
          userID: userID,
          createGtfsTime: userTime,
          service_id: agn.serviceName,
          monday: agn.monday,
          tuesday: agn.tuesday,
          wednesday: agn.wednesday,
          thursday: agn.thursday,
          friday: agn.friday,
          saturday: agn.saturday,
          sunday: agn.sunday,
          // start_date: new Date(agn.startDate),
          // end_date: new Date(agn.endDate)
          start_date: convert(agn.start_date),
          end_date: convert(agn.end_date),
        });
        newCalendarRecord.save(function (err) {
          if (err) {
            // res.json({success: false, message: err});
          }
        });
      });

      createFile(content, "calendar.txt", function (err, result) {
        if (err) {
          return callback(err, null);
        }
        callback(null, true);
      });
    });
  };

  let createStopsFile = function (callback) {
    stops.find({ userID: userID }, function (err, rez) {
      if (err) {
        return callback(err, null);
      }

      // console.log('rez:',rez,userID);

      let content =
        "stop_id,stop_code,stop_name,stop_desc,stop_lat,stop_lon,zone_id,stop_url,location_type,parent_station" +
        "\n";
      rez.forEach(function (agn) {
        content +=
          agn.stop_id +
          "," +
          agn.stop_code +
          "," +
          agn.stop_name +
          "," +
          agn.stop_desc +
          "," +
          agn.stop_lat +
          "," +
          agn.stop_lon +
          "," +
          agn.zone_id +
          "," +
          agn.stop_url +
          "," +
          agn.location_type +
          "," +
          agn.parent_station +
          "\n";
      });
      content = content.replace(/null/g, "");
      createFile(content, "stops.txt", function (err, result) {
        if (err) {
          return callback(err, null);
        }
        callback(null, true);
      });
    });
  };

  let getRandomColor = function () {
    let letters = "0123456789ABCDEF";
    let color = "";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  let dateToHr = function (date) {
    return moment(+date).format("HH");
  };

  let dateToMin = function (date) {
    return moment(+date).format("mm");
  };

  let createRoutesFile = function (callback) {
    routes.find({ userID: userID }, function (err, availableRoutes) {
      if (err) {
        return callback(JSON.stringify(err), null);
      }

      let content =
        "route_id,agency_id,route_short_name,route_long_name,route_desc,route_type,route_url,route_color,route_text_color" +
        "\n";
      availableRoutes.forEach(function (anotherRoute) {
        aRoutes[availableRoutesIndex] = anotherRoute;
        aRoutes[availableRoutesIndex]["shape_index_ID"] =
          "Route_" + anotherRoute.routeID + "_" + anotherRoute._id;
        availableRoutesFrequencies[availableRoutesIndex] = [];
        anotherRoute.frequency.forEach(function (felement, findex, farray) {
          availableRoutesFrequencies[availableRoutesIndex][findex] = {
            fr: null,
            time: null,
          };
          availableRoutesFrequencies[availableRoutesIndex][findex].fr =
            parseInt(felement.fr, 10) * minToSeconds;
          availableRoutesFrequencies[availableRoutesIndex][findex].time =
            +new Date(
              moment(
                startDayPattern +
                  felement.fromHr +
                  ":" +
                  anotherRoute.startRouteTime.fromMin,
                siteConfig.fullDatePattern
              ).format()
            );
        });

        // availableRoutesStartTime[availableRoutesIndex] = +new Date(moment(startDayPattern + anotherRoute.startRouteTime.startHr + ':' + anotherRoute.startRouteTime.startMin, siteConfig.fullDatePattern).format());
        // availableRoutesEndTime[availableRoutesIndex] = +new Date(moment(startDayPattern + anotherRoute.endRouteTime.startHr + ':' + anotherRoute.endRouteTime.startMin, siteConfig.fullDatePattern).format());
        // console.log(availableRoutesStartTime[availableRoutesIndex]);
        availableRoutesIndex++;

        content +=
          anotherRoute.routeID +
          "," +
          agencyId +
          "," +
          anotherRoute.routeName +
          "," +
          anotherRoute.routeName +
          " " +
          anotherRoute.routeDesc +
          "," +
          anotherRoute.routeDesc +
          "," +
          "3" +
          "," +
          "" +
          "," +
          getRandomColor() +
          "," +
          "\n";
        allRoutesArray.push(anotherRoute.routeID);
      });

      createFile(content, "routes.txt", function (err, result) {
        if (err) {
          return callback(err, null);
        }
        callback(null, true);
      });
    });
  };

  let zipFiles = function (callback) {
    // console.log("zip called");
    fileHelper.createZIP(userID, userTime, function (err, buffer) {
      if (err) return callback(err, null);
      // console.log(err);
      // console.log(buffer);
      callback(null, buffer);
    });
  };

  let deletePreviousFiles = function (callback) {
    fileHelper.deleteDownloadFolder(userID, userTime, function (err, dele) {
      if (err) return callback(err, null);

      callback(null, true);
    });
  };

  let createShapesFile = function (callback) {
    // console.log(allRoutes);
    fileHelper.createShapesSequence(
      userID,
      userTime,
      allRoutes,
      function (err, data) {
        if (err) {
          // console.log(err);
          return callback(err, null);
        } else {
          // console.log('createShapesFile:', data);
          callback(null, true);
        }
      }
    );
  };

  let createStopTimesFile = function (callback) {
    fileHelper.createStopTimeFile(
      userID,
      userTime,
      allRoutes,
      function (err, data) {
        if (err) {
          // console.log(err);
          return callback(err, null);
        } else {
          // console.log('createShapesFile:', data);
          callback(null, true);
        }
      }
    );
  };

  async.series(
    [
      deletePreviousFiles,
      getAllRoutes,
      createAgenciesFile,
      createCalendarFile,
      createCalendarDatesFile,
      createFareAttributesFile,
      createFareRulesFile,
      createFeedInfoFile,
      createFrequenciesFile,
      createStopsFile,
      createRoutesFile,
      createShapesFile,
      createStopTimesFile,
      zipFiles,
      writeConfig,
      //executeGTFS,
      //readDir,
      saveGTFSinDatabase,
      //moveDirectory
    ],
    function (err, results) {
      if (err) {
        // console.log(err);
        return res.json({ success: false, message: err });
      }

      let file =
        "./helpers/downloads/" + userID + "/" + userTime + "/download.zip";

      let filename = path.basename(file);
      let mimeType = mime.lookup(file);

      res.setHeader("Content-disposition", "attachment; filename=" + filename);
      res.setHeader("Content-type", mimeType);

      let fileStream = fs.createReadStream(file);
      fileStream.pipe(res);
    }
  );
});

module.exports = router;
