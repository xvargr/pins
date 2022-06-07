// npm init

const express = require("express"); //import the express npm module for easy server setup
const app = express(); //mapping express to app

const path = require("path"); //import path npm module to work with folder structure easier

const engine = require("ejs-mate"); //import ejs-mate engine for templating and boilerplate
app.engine("ejs", engine); //change default engine to ejs-mate

app.set("view engine", "ejs"); //set views engine to ejs
app.set("views", path.join(__dirname, "views")); //set views directory to a dynamic directory

const formMethod = require("method-override"); //gives forms access to more methods
app.use(formMethod("_method")); //defining methodOverride query value

const mongoose = require("mongoose"); //import mongoose module to work with mongo.db from js

//import schema models
const Library = require("./models/libraries");
const Review = require("./models/reviews");

const errorWrapper = require("./utils/errorWrapper"); //import error wrapper function
const ExpressError = require("./utils/ExpressError"); //import custom error class

// const Joi = require("joi"); // import joi javascript validator module // no longer required in this file as schema definition moved to own file
const { joiLibSchema, joiRevSchema } = require("./schemas/schemas");
const res = require("express/lib/response");
// const { populate } = require("./models/libraries"); // populate not used right now

mongoose.connect("mongodb://localhost:27017/libraries", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //connect mongoose to mongodb at this directory

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

app.listen(port, function () {
  console.log("---> App started");
  console.log(`---> Listening on port ${port}`);
}); //express start server

function joiLibValidate(req, res, next) {
  console.log("---> JOI library validation is running");
  const response = joiLibSchema.validate(req.body); //points joi to validate req.body based on joiSchema
  // throw error if there is an error validating
  if (response.error) {
    console.log("!--> JOI library validation failed");
    console.log(response);
    const message = response.error.details.map((el) => el.message).join(","); //I dont understand whi i cant just access message with response.error.details.message
    throw new ExpressError(message, 400);
  } else {
    console.log("---> JOI library validation passed");
    console.log(response);
    next(); //move on to the route handler
  }
}

function joiRevValidate(req, res, next) {
  console.log("---> JOI review validation is running");
  const response = joiRevSchema.validate(req.body);
  console.log(req.body);
  console.log(response);
  if (response.error) {
    console.log("!--> JOI review validation failed");
    console.log(response);
    const message = response.error.details.map((el) => el.message).join(","); //I dont understand whi i cant just access message with response.error.details.message
    throw new ExpressError(message, 400);
  } else {
    console.log("---> JOI review validation passed");
    console.log(response);
    next(); //move on to the route handler
  }
}

// TODO: streamline requests with more advanced express router to
// reduce duplicate code
app.get("/libraries", async function (req, res) {
  const result = await Library.find({});
  res.render("libraries/index", { result, req });
}); //run this when receiving get request to "/"

//; if get /:id is placed before /new, express will try to
//try to search and match a details page with the id of "new".
//place get /new first to solve this issue

app.get("/libraries/new", function (req, res) {
  res.render("libraries/new", { req });
}); //new form route for to create libraries

app.get(
  "/libraries/:id",
  errorWrapper(async function (req, res) {
    const { id } = req.params; //destructure req.params to get id
    const result = await Library.findById(id).populate("reviews");
    // console.log(result.reviews);
    res.render("libraries/details", { result, req });
  })
); //details route for specific libraries

app.get(
  "/libraries/:id/edit",
  errorWrapper(async function (req, res) {
    const { id } = req.params;
    const result = await Library.findById(id);
    res.render("libraries/edit", { result, req });
  })
); //serve edit form

app.post(
  "/libraries",
  joiLibValidate,
  errorWrapper(async function (req, res) {
    // the error wrapper is used to wrap this function in a try catch to catch any async errors
    //res.send(req.body); //by default, req.body is empty, it needs to be parsed
    // if (!req.body.lib) throw new ExpressError("Form data is unavailable", 400); //if body.lib does not exist, throw this error // replaced with joi
    const lib = new Library(req.body.lib);
    await lib.save();
    res.redirect(`/libraries/${lib._id}`);
  })
); // post req new library

app.put(
  "/libraries/:id",
  joiLibValidate,
  errorWrapper(async function (req, res) {
    const { id } = req.params;
    await Library.findByIdAndUpdate(
      id,
      { ...req.body.lib },
      { runValidators: true }
    ); //spread operator pass all elements of iterable lib
    res.redirect(`/libraries/${id}`);
  })
); //update route

app.delete(
  "/libraries/:id",
  errorWrapper(async function (req, res) {
    const { id } = req.params;
    await Library.findByIdAndDelete(id);
    res.redirect("/libraries");
  })
); //delete route

// review post route
// changes needed to account for rating an username
app.post(
  "/libraries/:id/reviews",
  joiRevValidate,
  errorWrapper(async function (req, res) {
    const library = await Library.findById(req.params.id);
    const review = new Review(req.body.review);
    library.reviews.push(review); // push newly made review into the library doc
    await review.save();
    await library.save();
    res.redirect(`/libraries/${req.params.id}`);
  })
);

// review delete route
app.delete(
  "/libraries/:id/reviews/:reviewId",
  errorWrapper(async function (req, res) {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Library.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // $pull will remove all instances of values that match reviews: reviewID
    res.redirect(`/libraries/${id}`);
  })
);

// review delete route // WIP TODO
// app.put("/libraries/:id/reviews/:reviewId", async function () {
//   res.send("rev delete route");
// });

// app.get("/newlibrary", async function (req, res) {
//   const lib = new Library({
//     name: "Test Library",
//     description: "This is a test library",
//   });
//   await lib.save(); //wait for this to finish
//   res.send(lib);
// }); //create async function and create a new test library

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
