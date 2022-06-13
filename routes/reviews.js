// router for /libraries path
const express = require("express");
const router = express.Router({ mergeParams: true });
// routers do not have access to params on the other side of the request that is on the main app.js
// i.e. the req.params.id in /libraries/:id/reviews that is on app.js, pass in in with mergeParams

// import flash message util func
const flashMessage = require("../utils/flashMessage");

// error imports
const errorWrapper = require("../utils/errorWrapper"); //import error wrapper function
const ExpressError = require("../utils/ExpressError"); //import custom error class

//import schema models // TODO move flash to an external function
const Library = require("../models/libraries");
const Review = require("../models/reviews");

// import joi schemas
const { joiRevSchema } = require("../schemas/schemas");

// JOI validation
function joiRevValidate(req, res, next) {
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
}

// review post route
// changes needed to account for rating an username
router.post(
  "/",
  joiRevValidate,
  errorWrapper(async function (req, res) {
    const library = await Library.findById(req.params.id);
    const review = new Review(req.body.review);
    library.reviews.push(review); // push newly made review into the library doc
    await review.save();
    await library.save();
    flashMessage(req, "success", "successfully posted review");
    res.redirect(`/libraries/${req.params.id}`);
  })
);

// review delete route
router.delete(
  "/:reviewId",
  errorWrapper(async function (req, res) {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Library.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // $pull will remove all instances of values that match reviews: reviewID
    flashMessage(req, "success", "successfully deleted review");
    res.redirect(`/libraries/${id}`);
  })
);

// review delete route // WIP TODO
// app.put("/libraries/:id/reviews/:reviewId", async function () {
//   res.send("rev delete route");
// });

module.exports = router;
