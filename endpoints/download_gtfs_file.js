const express = require("express");
const router = express.Router();
const routes = require("../models/routes");
const auth_helper = require("../helpers/auth_helper");
const agencies = require("../models/agencies");
const path = require("path");
const mime = require("mime");
const fs = require("fs");
const async = require("async");
const moment = require("moment");

/* GET home page. */
router.get("/", function (req, res, next) {
  let time = req.query.time;
  // let token = decodeURI(req.query.token);
  // console.log(req.query.token);
  let userID = req.query.id;
  if (!!!time)
    return res.json({
      success: false,
      message: "Mising obligatory" + " params!",
    });

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

  // async.series([
  //         userID
  //     ],
  // function (err, results) {
  //     if (err) {
  //         console.log(err);
  //         return res.json({success: false, message: err});
  //     }

  //   let file = "./helpers/downloads/" + userID + "/" + time + "/download.zip";
  const file = `${__dirname}/../helpers/downloads/${userID}/${time}/download.zip`;
  let filename = path.basename(file);
  let mimeType = mime.lookup(file);
  console.log(mimeType);
  res.setHeader("Content-disposition", "attachment; filename=" + filename);
  res.setHeader("Content-type", mimeType);

  res.download(file);

  //   let mimeType = mime.lookup(file);
  //   res.setHeader("Content-type", mimeType);

  //   let fileStream = fs.createReadStream(file);
  //   fileStream.pipe(res);

  // }
  // );
});

module.exports = router;
