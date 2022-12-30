let express = require("express");
let router = express.Router();
let fs = require("fs");
let async = require("async");
let moment = require("moment");
let siteConfig = require("../config/config");

router.get("/", function (req, res, next) {
  //stops.find({ stop_ID: req.decoded._id }, function (err, data) {
  //    if (err) {
  //        return res.json({ success: false, message: err.stringify() });
  //    }
  //    return res.json({ success: true, message: data, counts: count });
  //});
  //     let exec = require('child_process').exec;
  //     let userID = '5838e05abb6e9d261581f8b7';
  //     let userTime = '1489641174137';
  //     let agencyId = 'StefanSalat';
  //     let activeDate = '';
  //     let mapBoxToken = siteConfig.mapBoxToken;
  //
  //     let config = `{
  //     "mongoUrl": "mongodb://localhost:27017/gtfs",
  //     "agencies": [
  //         {
  //             "agency_key": "${agencyId}",
  //             "path": "/home/lou_cifer/WebstormProjects/transit-planner/helpers/downloads/${userID}/${userTime}"
  //         }
  //     ],
  //     "verbose": false,
  //     "effectiveDate": "${activeDate}",
  //     "noServiceSymbol": "—",
  //     "requestStopSymbol": "***",
  //     "showMap": true,
  //     "showOnlyTimepoint": true,
  //     "showStopCity": false,
  //     "mapboxAccessToken": "${mapBoxToken}",
  //     "zipOutput": true
  // }`;
  //     let today = moment().format('YYYYMMDD-') +  moment().add(1, 'days').format('YYYYMMDD');
  //     let resultPath = `./html/${agencyId}/${today}`;
  //     let outputFiles = [];
  //     console.log(resultPath);
  //
  //     let readDir = (callback) => {
  //         fs.readdir(resultPath, (err, files) => {
  //             if (err) return callback(err, null);
  //             files.forEach(file => {
  //                 outputFiles.push({name:file,path: resultPath.replace('./html/','') + '/' + file});
  //                 console.log(file);
  //             });
  //
  //             callback(null, 'ok');
  //         })
  //     };
  //
  //
  //
  //     let writeConfig =  (callback) => {
  //         fs.writeFile(`./helpers/downloads/${userID}/config.json`, config, function(err) {
  //             if(err) {
  //                 return callback(err, null);
  //             }
  //
  //             return callback(null, 'ok');
  //
  //         });
  //     };
  //
  //     let moveDirectory = (callback) => {
  //         let oldPath = `./html/${agencyId}`;
  //         let newPath = `./helpers/downloads/${userID}/${userTime}/${agencyId}`;
  //         fs.rename(oldPath, newPath, callback)
  //     };
  //
  //     let executeGTFS = (callback) => {
  //
  //         exec(`gtfs-to-html --configPath ./helpers/downloads/${userID}/config.json`, (error, stdout, stderr) => {
  //             if (error) return callback(error,null);
  //             callback(null,'ok');
  //         });
  //     };
  //     async.series([
  //             writeConfig,
  //             executeGTFS,
  //             readDir,
  //             moveDirectory
  //         ],
  //         function (err, results) {
  //             if (err) {
  //                 console.log(err);
  //                 return res.json({success: false, message: err});
  //             }
  //
  //            res.json({success: true, message: 'Route parsed', files: outputFiles});
  //
  //         });
  res.send("ok Working");
});

module.exports = router;
