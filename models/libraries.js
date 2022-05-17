const mongoose = require("mongoose"); //import mongoose module to work with mongo.db from js
const Schema = mongoose.Schema; //maps Schema to mongoose.Schema as a shortcut

const LibrarySchema = new Schema({
  name: String,
  description: String,
  image: String,
  fee: Number,
  location: String,
}); //defining the schema for libraries

module.exports = mongoose.model("Library", LibrarySchema); //compile the library model from the schema and export it
