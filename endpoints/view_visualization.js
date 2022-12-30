let express = require('express');
let router = express.Router();
let fs = require('fs');
let async = require('async');
let moment = require('moment');
let siteConfig = require('../config/config');
let files = require('../models/files');

router.get('/', function(req, res, next) {

    let time = req.query.time;
    let path = req.query.path;
    let pattern = new RegExp('\\.\\./', 'g');
    path = decodeURIComponent(path);
    path = path.replace(pattern, '');
    let userID = req.query.userID;
    let css = `
    <style>
    body {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.42857143;
  color: #333333;
  background-color: #ffffff;
}

h1 {
  margin-bottom: 10px;
}

.content {
  min-height: 400px;
  margin: 20px;
}

.timetable {
  margin-bottom: 35px;
}

.table-of-contents {
  list-style-type: none;
}

.timetable .table {
  width: auto;
}

.timetable-bottom {
  overflow: hidden;
}

.notes {
  width: 50%;
  float: left;
}

.notes .note {
  display: inline-block;
  margin-right: 15px;
}

.route-name {
  width: 350px;
  display: inline-block;
  font-weight: bold;
  line-height: 28px;
}

.stop_time {
  text-align: center;
}

.city_row {
  font-size: 1.5em;
  color: #415d86;
}

.calendar_dates {
  width: 50%;
  float: right;
}

.included_dates,
.excluded_dates {
  width: 300px;
  float: right;
}

.map {
  width: 100%;
  height: 500px;
  margin-top: 20px;
}

table {
  background-color: transparent;
  width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
  border: 1px solid #dddddd;
  border-collapse: collapse;
  border-spacing: 0;
}
th {
  text-align: left;
}
td,
th {
  padding: 0;
}
table > thead > tr > th,
table > tbody > tr > th,
table > tfoot > tr > th,
table > thead > tr > td,
table > tbody > tr > td,
table > tfoot > tr > td {
  padding: 8px;
  line-height: 1.42857143;
  vertical-align: top;
  border: 1px solid #dddddd;
}
table > thead > tr > th {
  vertical-align: bottom;
  border-bottom: 2px solid #dddddd;
}
table > caption + thead > tr:first-child > th,
table > colgroup + thead > tr:first-child > th,
table > thead:first-child > tr:first-child > th,
table > caption + thead > tr:first-child > td,
table > colgroup + thead > tr:first-child > td,
table > thead:first-child > tr:first-child > td {
  border-top: 0;
}
table > tbody + tbody {
  border-top: 2px solid #dddddd;
}
table > thead > tr > th,
table > thead > tr > td {
  border-bottom-width: 2px;
}
table > tbody > tr:nth-of-type(odd) {
  background-color: #f9f9f9;
}

.table-responsive {
  min-height: .01%;
  overflow-x: auto;
}
@media screen and (max-width: 767px) {
  .table-responsive {
    width: 100%;
    margin-bottom: 15px;
    overflow-y: hidden;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    border: 1px solid #ddd;
  }
  .table-responsive > table {
    margin-bottom: 0;
  }
  .table-responsive > table > thead > tr > th,
  .table-responsive > table > tbody > tr > th,
  .table-responsive > table > tfoot > tr > th,
  .table-responsive > table > thead > tr > td,
  .table-responsive > table > tbody > tr > td,
  .table-responsive > table > tfoot > tr > td {
    white-space: nowrap;
  }
  .table-responsive > .table-bordered {
    border: 0;
  }
  .table-responsive > .table-bordered > thead > tr > th:first-child,
  .table-responsive > .table-bordered > tbody > tr > th:first-child,
  .table-responsive > .table-bordered > tfoot > tr > th:first-child,
  .table-responsive > .table-bordered > thead > tr > td:first-child,
  .table-responsive > .table-bordered > tbody > tr > td:first-child,
  .table-responsive > .table-bordered > tfoot > tr > td:first-child {
    border-left: 0;
  }
  .table-responsive > .table-bordered > thead > tr > th:last-child,
  .table-responsive > .table-bordered > tbody > tr > th:last-child,
  .table-responsive > .table-bordered > tfoot > tr > th:last-child,
  .table-responsive > .table-bordered > thead > tr > td:last-child,
  .table-responsive > .table-bordered > tbody > tr > td:last-child,
  .table-responsive > .table-bordered > tfoot > tr > td:last-child {
    border-right: 0;
  }
  .table-responsive > .table-bordered > tbody > tr:last-child > th,
  .table-responsive > .table-bordered > tfoot > tr:last-child > th,
  .table-responsive > .table-bordered > tbody > tr:last-child > td,
  .table-responsive > .table-bordered > tfoot > tr:last-child > td {
    border-bottom: 0;
  }

  .notes {
    width: 100%;
    float: none;
    padding-bottom: 15px;
  }

  .calendar_dates {
    width: 100%;
    float: none;
    padding-bottom: 15px;
  }

  .excluded_dates {
    width: 100%;
    float: none;
    padding-bottom: 15px;
  }
}
 </style>
`;

    if (!!!time || !!!path || !!!userID) {
        return res.json({success: false, message: 'Missing obligatory params!'});
    }

    let getFiles = (callback) => {
        files.findOne({time: time,userID: userID},function (err, pathRes) {
            if (err) return callback(err, null);

            if (!pathRes) return callback('This route is missing!',null);

            callback(null,'ok');
        })
    };

    let readFile = (callback) => {
        console.log(`./helpers/downloads/${userID}/${time}/${path}`);
        fs.readFile(`./helpers/downloads/${userID}/${time}/${path}`, 'utf8', function (err,data) {
            if (err) {
                return callback(err,null);
            }
            callback(null,data);
        });
    };


    async.series([
            getFiles,
            readFile

        ],
        function (err, results) {
            if (err) {
                console.log(err);
                return res.json({success: false, message: err});
            }

            res.send(results[1].replace('<link rel="stylesheet" href="../timetable_styles.css">',css));

        }
    );

});

module.exports = router;
