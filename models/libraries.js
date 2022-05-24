const mongoose = require("mongoose"); //import mongoose module to work with mongo.db from js
const Schema = mongoose.Schema; //maps Schema to mongoose.Schema as a shortcut

const LibrarySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: false },
  fee: { type: Number, required: true, min: 0 },
  location: { type: String, required: true },
}); //defining the schema for libraries

module.exports = mongoose.model("Library", LibrarySchema); //compile the library model from the schema and export it
