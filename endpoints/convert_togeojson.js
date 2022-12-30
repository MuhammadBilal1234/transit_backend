/**
 * Created by lou_cifer on 20.02.17.
 */

var express = require("express");
var fs = require("fs");
const tj = require("@tmcw/togeojson");

var router = express.Router();
const DOMParser = require("xmldom").DOMParser;
const findRemoveSync = require("find-remove");
// const file = require("../uploads");

/* GET home page. */
router.post("/", function (req, res) {
  console.log(req.file);

  try {
    const kml = new DOMParser().parseFromString(
      fs.readFileSync(req.file.path, "utf8")
    );
    const converted = tj.kml(kml);

    let resultHandler = function (err) {
      if (err) {
        console.log("unlink failed", err);
      } else {
        console.log("file deleted");
      }
    };

    fs.unlink(req.file.path, resultHandler);

    res.send(converted);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

module.exports = router;
