//this will seed the database with randomly created test data

const mongoose = require("mongoose"); //import mongoose module to work with mongo.db from js
const Library = require("../models/libraries"); //import library model
const seedName = require("./seedNames"); //import seedNames
const cities = require("./cities"); //import cities data

const size = 50;

mongoose.connect("mongodb://localhost:27017/libraries", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //connect mongoose to mongodb at this directory

const db = mongoose.connection; //assign db shorthand to mongoose.connection
db.on(
  "error",
  console.error.bind(console, "!--> Connection to mongo.db failed")
); //on error connecting to mongo
db.once("open", function () {
  console.log("---> Mongo.db connected");
}); //once mongo is connected

function pickOne(array) {
  return array[Math.floor(Math.random() * array.length)];
} //function picks one of the index of an array on random

const seedDB = async function () {
  await Library.deleteMany({}); //delete everything in the Library database
  for (let i = 0; i < size; i++) {
    const lib = new Library({
      name: `${pickOne(seedName.verbs)} ${pickOne(seedName.nouns)}`, //get random index and make a random name
      location: `${pickOne(cities).city}, ${pickOne(cities).state}`,
    });
    await lib.save(); //save the new lib
  }
}; //generate 50 new items with randomized name and locations

seedDB(); //run seedDB
