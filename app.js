// npm init
const express = require("express"); //import the express npm module for easy server setup
const app = express(); //mapping express to app
const session = require("express-session"); // impost session module

const flash = require("connect-flash"); // import flash for alert messages

const path = require("path"); //import path npm module to work with folder structure easier

const engine = require("ejs-mate"); //import ejs-mate engine for templating and boilerplate
app.engine("ejs", engine); //change default engine to ejs-mate

app.set("view engine", "ejs"); //set views engine to ejs
app.set("views", path.join(__dirname, "views")); //set views directory to a dynamic directory

const formMethod = require("method-override"); //gives forms access to more methods
app.use(formMethod("_method")); //defining methodOverride query value

const mongoose = require("mongoose"); //import mongoose module to work with mongo.db from js

// //import schema models
// const Library = require("./models/libraries");
// const Review = require("./models/reviews");

// const errorWrapper = require("./utils/errorWrapper"); //import error wrapper function
const ExpressError = require("./utils/ExpressError"); //import custom error class

// const Joi = require("joi"); // import joi javascript validator module // no longer required in this file as schema definition moved to own file
// const { joiLibSchema, joiRevSchema } = require("./schemas/schemas");
// const res = require("express/lib/response");
// const { populate } = require("./models/libraries"); // populate not used right now

// router imports, for compartmentalizing routes
const libraries = require("./routes/libraries");
const reviews = require("./routes/reviews");

//connect mongoose to mongodb at this directory
mongoose.connect("mongodb://localhost:27017/libraries", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection; //assign db shorthand to mongoose.connection
db.on(
  "error",
  console.error.bind(console, "!--> Connection to mongo.db failed")
); //on error connecting to mongo
db.once("open", function () {
  console.log("---> Mongo.db connected");
}); //once mongo is connected

const port = 3000; //set listening port to this

app.use(express.urlencoded({ extended: true })); //express middleware body parser
app.use(express.static(__dirname + "/")); //serve static files at "/" directory with express

//express start server
app.listen(port, function () {
  console.log("---> App started");
  console.log(`---> Listening on port ${port}`);
});

// session and cookie
const sessionConfig = {
  secret: "libsAreSecretlyGood",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // js millisecond based time
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// flash messages and variable reassignment middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.status = req.flash("status"); // just reassigns flash message to res.locals
  res.locals.message = req.flash("message");
  next(); // don't forget next, which makes this a middleware, else the request will just stop here
});
// this is done so that we always have req.flash in locals, and don't need to pass it to render every time

// routers
app.use("/libraries", libraries); // for routes that starts with /libraries, use the libraries router
app.use("/libraries/:id/reviews", reviews); // for routes that starts with /libraries/:id/reviews, use the libraries router
// params needs to be passed on the router file with mergeParams

// serve static files
app.use(express.static(path.join(__dirname, "public")));

// 404 catch
app.all("*", function (req, res, next) {
  console.log("!---> 404 triggered");
  next(new ExpressError("Page Not Found", 404));
});

// Custom Error Handler
app.use(function (err, req, res, next) {
  console.log("!--> handled error");
  console.log(err);
  const { message = "Something went wrong", status = 500 } = err; //destructure msg and status from err, passed from next
  // res.status(status).send(message);
  console.log(status, message);
  res.render("error", { req, err, message, status });
  // next(err);
});
