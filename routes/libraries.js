// router for /libraries path
const express = require("express");
const router = express.Router();

const errorWrapper = require("../utils/errorWrapper"); //import error wrapper function
const ExpressError = require("../utils/ExpressError"); //import custom error class

// import flash for alert messages
const flash = require("connect-flash");

//import schema models
const Library = require("../models/libraries");

// import joi schemas
const { joiLibSchema } = require("../schemas/schemas");

// JOI validation
function joiLibValidate(req, res, next) {
  console.log("---> JOI library validation is running");
  const response = joiLibSchema.validate(req.body); //points joi to validate req.body based on joiSchema
  // throw error if there is an error validating
  if (response.error) {
    console.log("!--> JOI library validation failed");
    console.log(response);
    const message = response.error.details.map((el) => el.message).join(","); //I don't understand whi i cant just access message with response.error.details.message
    throw new ExpressError(message, 400);
  } else {
    console.log("---> JOI library validation passed");
    console.log(response);
    next(); //move on to the route handler
  }
}

router.get("/", async function (req, res) {
  const result = await Library.find({});
  res.render("libraries/index", { result, req });
}); //run this when receiving get request to "/"

//; if get /:id is placed before /new, express will try to
//try to search and match a details page with the id of "new".
//place get /new first to solve this issue

//new form route for to create libraries
router.get("/new", function (req, res) {
  res.render("libraries/new", { req });
});

//details route
router.get(
  "/:id",
  errorWrapper(async function (req, res) {
    const { id } = req.params; //destructure req.params to get id
    const result = await Library.findById(id).populate("reviews");
    // console.log(result.reviews);
    res.render("libraries/details", { result, req });
  })
);

// edit route
router.get(
  "/:id/edit",
  errorWrapper(async function (req, res) {
    const { id } = req.params;
    const result = await Library.findById(id);
    res.render("libraries/edit", { result, req });
  })
);

// post req new library
router.post(
  "/",
  joiLibValidate,
  errorWrapper(async function (req, res) {
    // the error wrapper is used to wrap this function in a try catch to catch any async errors
    // res.send(req.body); //by default, req.body is empty, it needs to be parsed
    // if (!req.body.lib) throw new ExpressError("Form data is unavailable", 400); //if body.lib does not exist, throw this error // replaced with joi
    const lib = new Library(req.body.lib);
    await lib.save();
    req.flash("success", "Successfully created new library");
    res.redirect(`/libraries/${lib._id}`);
  })
);

//update route
router.put(
  "/:id",
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
);

//delete route
router.delete(
  "/:id",
  errorWrapper(async function (req, res) {
    const { id } = req.params;
    await Library.findByIdAndDelete(id);
    res.redirect("/libraries");
  })
);

module.exports = router;
