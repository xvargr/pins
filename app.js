// if in development mode, require the dotenv package
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  // .env files are hidden files where we store values that we want hidden
  // key value pairs in the file can be accessed without displaying the secret value in our code when we share or ship it
  // console.log(process.env.CLOUDINARY_KEY);
  // console.log(process.env.CLOUDINARY_SECRET);
}

// npm init
const express = require("express"); //import the express npm module for easy server setup
const app = express(); //mapping express to app
const session = require("express-session"); // impost session module
const MongoStore = require("connect-mongo"); // session storage using mongo

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
const LocalStrategy = require("passport-local"); // and the local auth strategy for passport
const User = require("./models/users"); // import user model for use with passport

// const errorWrapper = require("./utils/errorWrapper"); //import error wrapper function
const ExpressError = require("./utils/ExpressError"); //import custom error class

// const Joi = require("joi"); // import joi javascript validator module // no longer required in this file as schema definition moved to own file
// const { joiLibSchema, joiRevSchema } = require("./schemas/schemas");
// const res = require("express/lib/response");
// const { populate } = require("./models/libraries"); // populate not used right now

const mongoSanitize = require("express-mongo-sanitize");

const helmet = require("helmet");
const cors = require("cors");

// router imports, for compartmentalizing routes
const libraryRoutes = require("./routes/libraries");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const libraries = require("./models/libraries");
// const { compile } = require("joi");

mongoose.set("strictQuery", false);

//connect mongoose to mongodb at this directory
const dbUrl = process.env.ATLAS_URL || "mongodb://localhost:27017/libraries";
mongoose.connect(dbUrl, {
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
const port = process.env.PORT || 3000; //set listening port to this, heroku default 80, 3000 for local
app.listen(port, function () {
  console.log("---> App started");
  console.log(`---> Listening on port ${port}`);
});

// session and cookie
const secret = process.env.SECRET || "libsAreSecretlyGood";
const sessionConfig = {
  name: "libCookie",
  secret,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60, // lazy update, only update after certain time if no changes, reduces unnecessary updates and bandwidth use
  }),
  cookie: {
    httpOnly: true, // set cookies to only be accessible through http, not js, security measure
    // secure: true, // set cookie to only be accessible through https
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // js millisecond based time
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// use routes, on every requests
app.use(express.urlencoded({ extended: true })); //express middleware body parser
app.use(express.static(__dirname + "/")); //serve static files at "/" directory with express

// helmet header attack protection
const scriptSrcUrls = [
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "mapbox://styles/mapbox/dark-v10",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "https://*.mapbox.com"],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dndf29tdn/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://i.picsum.photos/",
        "https://picsum.photos/",
        "https://fastly.picsum.photos",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

app.use(mongoSanitize()); // sanitizes req.query, req.params, and req.body from query injection
// app.use(helmet({ crossOriginResourcePolicy: true }));
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// use mongoSanitize({replaceWith:"_"}) to replace prohibited characters instead of removing them

// serve static files
app.use(express.static(path.join(__dirname, "public")));

// flash messages and variable reassignment middleware using locals and sessions
app.use(flash()); // innit flash, now all req objects have a method called flash("key", "message")
app.use(function (req, res, next) {
  res.locals.status = req.flash("status"); // just reassigns flash message to res.locals
  res.locals.message = req.flash("message"); // take the value associated with the "message" key
  // console.log("session");
  // console.log(req.session);
  // console.log("locals");
  // console.log(res.locals);
  // console.log(req.query);

  // passport error special case
  const passportFlash = req.flash("error");
  if (passportFlash.length > 0) {
    res.locals.status = "error";
    res.locals.message = passportFlash;
    // console.log(res.locals.message);
  }

  // can't use this, flash is single use, but even checking if it's > 0 seems to delete it
  // no way to check flash, it's like some quantum mechanics bs
  // console.log(req.flash("error").length > 0); // returns true
  // console.log(req.flash("error")); // but then is empty here
  // if (req.flash("error").length > 0) {
  // ...
  // }

  req.session.lastPath = req.session.currPath; // where were you?
  req.session.currPath = req.path; // where are you going?

  // console.log("/// APP>JS>107 ///");
  // console.log("/// SESSION ///");
  // console.log(req.session);
  // console.log("/// LOCALS ///");
  // console.log(res.locals);

  next(); // don't forget next, which makes this a middleware, else the request will just stop here
});
// this is done so that we always have req.flash in locals, and don't need to pass it to render every time

// passport auth middleware
app.use(passport.initialize()); // initializes passport
app.use(passport.session()); // use sessions for persistent logins with passport
passport.use(new LocalStrategy(User.authenticate())); // use local strategy authentication, with the auth method being authenticate() on the User model. that model is added to the user model with UserSchema.plugin(passLocMongoose)
passport.serializeUser(User.serializeUser()); // use this method to serialize users, basically how to store in session????
passport.deserializeUser(User.deserializeUser()); // use this method to deserialize users, read from session

// pass on user info to locals
app.use(function (req, res, next) {
  res.locals.user = req.user; // user data, else undefined if not logged in
  // console.log(req.path);
  // console.log("/// USER ///");
  console.log(req.path);
  console.log(res.header);
  next();
});

app.get("/health", cors(), (req, res) => {
  res.status(200).send("Ok");
});

// routers
app.use("/libraries", libraryRoutes); // for routes that starts with /libraries, use the libraries router
app.use("/libraries/:id/reviews", reviewRoutes); // for routes that starts with /libraries/:id/reviews, use the libraries router
app.use("/users", userRoutes);
// params needs to be passed on the router file with mergeParams

app.get("/", async function (req, res) {
  const result = await libraries.find();
  // res.set(
  //   "Content-Security-Policy",
  //   "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  // );
  res.render("libraries/home", { result });
});

// 404 catch
app.all("*", function (req, res, next) {
  console.log(`!--> 404 triggered for ${req.path}`);
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
