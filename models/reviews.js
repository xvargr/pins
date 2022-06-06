const mongoose = require("mongoose");

// defining the schema for reviews of libraries, contains text and a rating

const reviewSchema = new mongoose.Schema({
  user: { type: String, default: "Default Dan", required: true },
  text: { type: String, default: "Default text", required: true },
  rating: { type: Number, min: 1, max: 5, default: 3, required: true },
});

module.exports = mongoose.model("Review", reviewSchema);
