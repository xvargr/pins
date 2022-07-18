// controller file, logic goes here

// models import
const Library = require("../models/libraries");
const Review = require("../models/reviews");
// import flash message util func
const flashMessage = require("../utils/flashMessage");

module.exports.newReview = async function (req, res) {
  const library = await Library.findById(req.params.id);
  const review = new Review(req.body.review);
  review.owner = req.user._id; // assigns the current logged in user as the owner of the new review
  library.reviews.push(review); // push newly made review into the library doc
  await review.save();
  await library.save();
  flashMessage(req, "success", "successfully posted review");
  res.redirect(`/libraries/${req.params.id}`);
};
module.exports.deleteReview = async function (req, res) {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Library.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // $pull will remove all instances of values that match reviews: reviewID
  flashMessage(req, "success", "successfully deleted review");
  res.redirect(`/libraries/${id}`);
};
