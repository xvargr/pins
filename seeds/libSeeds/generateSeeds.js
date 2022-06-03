//this will seed the database with randomly created test data

const mongoose = require("mongoose"); //import mongoose module to work with mongo.db from js
const Library = require("../models/libraries"); //import library model
const seedName = require("./seedNames"); //import seedNames
const cities = require("./cities"); //import cities data

const size = 50;
const maxPrice = 100;

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

function randomPrice(max = maxPrice, min = 0) {
  if (min === 0) {
    return Math.floor(Math.random() * max);
  } else {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

async function seedDB() {
  await Library.deleteMany({}); //delete everything in the Library database
  for (let i = 0; i < size; i++) {
    const lib = new Library({
      name: `${pickOne(seedName.verbs)} ${pickOne(seedName.nouns)}`,
      description:
        "I used to practice weaving with spaghetti three hours a day but stopped because I didn't want to die alone.",
      image: "https://via.placeholder.com/650x450",
      fee: randomPrice(),
      location: `${pickOne(cities).city}, ${pickOne(cities).state}`,
    });
    await lib.save(); //save the new lib
  }
} //generate 50 new items with randomized name and locations

seedDB(); //run seedDB

console.log("---> Database seeded!");
