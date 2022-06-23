// router for /libraries path
const express = require("express");
const router = express.Router({ mergeParams: true });
// routers do not have access to params on the other side of the request that is on the main app.js
// i.e. the req.params.id in /libraries/:id/reviews that is on app.js, pass in in with mergeParams

// import flash message util func
const flashMessage = require("../utils/flashMessage");

// error imports
const errorWrapper = require("../utils/errorWrapper"); //import error wrapper function

//import schema models // TODO move flash to an external function
const Library = require("../models/libraries");
const Review = require("../models/reviews");

const {
  joiRevValidate,
  isLoggedIn,
  isRevOwner,
} = require("../utils/middleware");

// review post route
// changes needed to account for rating an username
router.post(
  "/",
  isLoggedIn,
  joiRevValidate,
  errorWrapper(async function (req, res) {
    const library = await Library.findById(req.params.id);
    const review = new Review(req.body.review);
    review.owner = req.user._id; // assigns the current logged in user as the owner of the new review
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
  isLoggedIn,
  isRevOwner,
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
