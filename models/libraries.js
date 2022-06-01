const mongoose = require("mongoose"); //import mongoose module to work with mongo.db from js
const Schema = mongoose.Schema; //maps Schema to mongoose.Schema as a shortcut

const LibrarySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: false },
  fee: { type: Number, required: true, min: 0 },
  location: { type: String, required: true },
  reviews: [
    {
      // this defines that the reviews key is a reference to another schema
      // mongoose will only store the object id of connected reviews
      // to populate it based on the ids stored use the populate method
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
}); //defining the schema for libraries

module.exports = mongoose.model("Library", LibrarySchema); //compile the library model from the schema and export it
