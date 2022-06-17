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

const passport = require("passport"); // import npm module for user auth
const passportLocal = require("passport-local"); // and the local auth strategy for passport
const User = require("./models/users"); // import user model for use with passport

// const errorWrapper = require("./utils/errorWrapper"); //import error wrapper function
const ExpressError = require("./utils/ExpressError"); //import custom error class

// const Joi = require("joi"); // import joi javascript validator module // no longer required in this file as schema definition moved to own file
// const { joiLibSchema, joiRevSchema } = require("./schemas/schemas");
// const res = require("express/lib/response");
// const { populate } = require("./models/libraries"); // populate not used right now

// router imports, for compartmentalizing routes
const libraryRoutes = require("./routes/libraries");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
// const { compile } = require("joi");

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

//express start server
const port = 3000; //set listening port to this
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

// use routes, on every requests
app.use(express.urlencoded({ extended: true })); //express middleware body parser
app.use(express.static(__dirname + "/")); //serve static files at "/" directory with express

// flash messages and variable reassignment middleware
app.use(flash()); // innit flash, now all req objects have a method called flash("key", "message")
app.use(function (req, res, next) {
  res.locals.status = req.flash("status"); // just reassigns flash message to res.locals
  res.locals.message = req.flash("message"); // take the value associated with the "message" key
  // console.log(res.locals);
  console.log(req.session); // <----- HERE!!! passport flash doesn't work, but there is a flash property here in session instead of locals
  next(); // don't forget next, which makes this a middleware, else the request will just stop here
});
// this is done so that we always have req.flash in locals, and don't need to pass it to render every time

// passport auth middleware
app.use(passport.initialize()); // initializes passport
app.use(passport.session()); // use sessions for persistent logins with passport
passport.use(new passportLocal(User.authenticate())); // use local strategy authentication, with the auth method being authenticate() on the User model. that model is added to the user model with UserSchema.plugin(passLocMongoose)
passport.serializeUser(User.serializeUser()); // use this method to serialize users, basically how to store in session????
passport.deserializeUser(User.deserializeUser()); // use this method to deserialize users

// routers
app.use("/libraries", libraryRoutes); // for routes that starts with /libraries, use the libraries router
app.use("/libraries/:id/reviews", reviewRoutes); // for routes that starts with /libraries/:id/reviews, use the libraries router
app.use("/users", userRoutes);
// params needs to be passed on the router file with mergeParams

// serve static files
app.use(express.static(path.join(__dirname, "public")));

// 404 catch
app.all("*", function (req, res, next) {
  console.log("!--> 404 triggered");
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
