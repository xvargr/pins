const mongoose = require("mongoose"); //import mongoose module to work with mongo.db from js
const Schema = mongoose.Schema; //maps Schema to mongoose.Schema as a shortcut
const Review = require("./reviews"); // import reviews schema

// nested schema, needed this to make a virtual .get for cloudinary image resizing
const ImageSchema = new Schema({
  url: String,
  filename: String,
});
// virtual getter
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_400");
});

// define the schema for new library document
const LibrarySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [ImageSchema],
  fee: { type: Number, required: true, min: 0 },
  location: { type: String, required: true },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  owner: {
    // owner is a reference
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      // this defines that the reviews key is a reference to another schema
      // mongoose will only store the object id of connected reviews
      // to populate it based on the ids stored use the populate method
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// post middleware, not clear how this works, perhaps this middleware runs post (after) findOneAndDelete was run on a library document
LibrarySchema.post("findOneAndDelete", async function (doc) {
  // more complicated query remove that doesn't need to reiterate
  if (doc) {
    // delete reviews that has their id in doc.reviews (query)
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }

  // const reviews = doc.reviews;
  // for (review of reviews) {
  //   await Review.findByIdAndDelete(review._id);
  // }
});

module.exports = mongoose.model("Library", LibrarySchema); //compile the library model from the schema and export it
