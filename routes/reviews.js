// router for /libraries path
const express = require("express");
const router = express.Router({ mergeParams: true });
// routers do not have access to params on the other side of the request that is on the main app.js
// i.e. the req.params.id in /libraries/:id/reviews that is on app.js, pass in in with mergeParams

// import controller file
const reviewController = require("../controllers/reviews");

// error imports
const errorWrapper = require("../utils/errorWrapper"); //import error wrapper function

const { joiRevValidate, isLoggedIn, isOwner } = require("../utils/middleware");

// review post route
// changes needed to account for rating an username
router.post(
  "/",
  isLoggedIn,
  joiRevValidate,
  errorWrapper(reviewController.newReview)
);

// review delete route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isOwner,
  errorWrapper(reviewController.deleteReview)
);

module.exports = router;
