// Middleware file

////// AUTHENTICATION AND AUTHORIZATION
const flashMessage = require("../utils/flashMessage");
const Library = require("../models/libraries");

// uses the isAuthenticated passport middleware to check if user is signed in
module.exports.isLoggedIn = function (req, res, next) {
  // this uses sessions
  // console.log(req.user);
  if (req.isUnauthenticated()) {
    flashMessage(req, "error", "You need to sign in to view this page");
    // console.log(req.path);
    // console.log(req.session.currPath);
    const reroute = req.session.lastPath;
    return res.redirect(reroute); // redirect back to where user was before accessing prohibited page
  }
  next();
};

// check if current logged in user is the owner of the document being modified, let pass if true
module.exports.isLibOwner = async function (req, res, next) {
  console.log("========== PATH ===============");
  const path = req.originalUrl;

  if (path.includes()) {
    // for /libraries and /reviews for all in one function
  }
  const { id } = req.params;
  const lib = await Library.findById(id);

  if (req.user._id.valueOf() !== lib.owner.valueOf()) {
    flashMessage(req, "error", "You must be the owner to update");
    return res.redirect(`/libraries/${id}`);
  }
  next();
};

// check if current logged in user is the owner of the review item, let pass if true
module.exports.isRevOwner = async function (req, res, next) {
  // const { id } = req.params;
  // const lib = await Library.findById(id);

  // if (req.user._id.valueOf() !== lib.owner.valueOf()) {
  //   flashMessage(req, "error", "You must be the owner to update");
  //   return res.redirect(`/libraries/${id}`);
  // }
  next();
};

////// REVIEWS
const ExpressError = require("../utils/ExpressError"); //import custom error class
const { joiRevSchema } = require("../schemas/schemas");

// JOI review validation
module.exports.joiRevValidate = function (req, res, next) {
  // console.log("---> JOI review validation is running");
  const response = joiRevSchema.validate(req.body);
  // console.log(req.body);
  // console.log(response);
  if (response.error) {
    // console.log("!--> JOI review validation failed");
    // console.log(response);
    flashMessage(req, "error", "problem in creating review");
    const message = response.error.details.map((el) => el.message).join(","); //I don't understand whi i cant just access message with response.error.details.message
    throw new ExpressError(message, 400);
  } else {
    // console.log("---> JOI review validation passed");
    // console.log(response);
    next(); //move on to the route handler
  }
};

////// LIBRARIES
const { joiLibSchema } = require("../schemas/schemas");

module.exports.joiLibValidate = function (req, res, next) {
  // console.log("---> JOI library validation is running");
  const response = joiLibSchema.validate(req.body); //points joi to validate req.body based on joiSchema
  // throw error if there is an error validating
  if (response.error) {
    // console.log("!--> JOI library validation failed");
    // console.log(response);
    const message = response.error.details.map((el) => el.message).join(","); //I don't understand whi i cant just access message with response.error.details.message
    throw new ExpressError(message, 400);
  } else {
    // console.log("---> JOI library validation passed");
    // console.log(response);
    next(); //move on to the route handler
  }
};
