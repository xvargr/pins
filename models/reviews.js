const mongoose = require("mongoose");

// defining the schema for reviews of libraries, contains text and a rating

const reviewSchema = new mongoose.Schema({
  text: String,
  rating: Number,
});

module.exports = mongoose.model("Review", reviewSchema);
