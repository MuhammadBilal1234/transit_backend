var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");

var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var config = require("./config/config");
var bcrypt = require("bcrypt");
var passport = require("passport");
var usersModel = require("./models/users");
var Strategy = require("passport-facebook").Strategy;
var cors = require("cors");
mongoose
  // .connect(
  //   "mongodb://anbn:123456@localhost:27016/transit-planner?authSource=admin"
  // )
  .connect(
    // `mongodb+srv://bilal:bilal@transit-planner.atxp33u.mongodb.net/?retryWrites=true&w=majority`
    `mongodb://admin:admin@ac-chiafsk-shard-00-00.atxp33u.mongodb.net:27017,ac-chiafsk-shard-00-01.atxp33u.mongodb.net:27017,ac-chiafsk-shard-00-02.atxp33u.mongodb.net:27017/?ssl=true&replicaSet=atlas-umgafo-shard-0&authSource=admin&retryWrites=true&w=majority`
  )
  .then((res) => console.log("WORKING MONOG "))
  .catch((err) => console.log("ERR ", err));
// mongoose.connect(
//   "mongodb://anbn:123456@mongo:27017/transit-planner?authSource=admin"
// );
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var ensureAuth = require("./helpers/auth_helper").ensureAuth;

//Page references

require("./helpers/passport.js")(
  passport,
  Strategy,
  GoogleStrategy,
  usersModel
);

var app = express();
app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  require("express-session")({
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", express.static(path.join(__dirname, "public")));
//ENDPOINTS
require("./router/index")(app, ensureAuth);

//PASSPORT ROUTES
require("./helpers/passport_routes")(passport, app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
