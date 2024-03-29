//this will seed the database with randomly created test data
const dotenv = require("dotenv").config();
const mongoose = require("mongoose"); //import mongoose module to work with mongo.db from js
const Library = require("../../models/libraries"); //import library model
const seedName = require("./seedNames"); //import seedNames
const cities = require("./cities"); //import cities data

const User = require("../../models/users");
const ExpressError = require("../../utils/ExpressError");

const sentencesFile = require("../words/sentences");

const size = 50;
const maxPrice = 100;

mongoose.set("strictQuery", false);

mongoose.connect(`${process.env.ATLAS_URL}`, {
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

function randomNumber(max = maxPrice, min = 0) {
  if (min === 0) {
    return Math.floor(Math.random() * max);
  } else {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

function getRandomSentence() {
  const result =
    sentencesFile.sentences[
      Math.floor(Math.random() * sentencesFile.sentences.length + 1)
    ];

  return result;
}

const defaultOwner = "admin";
async function seedDB() {
  await Library.deleteMany({}); //delete everything in the Library database
  for (let i = 0; i < size; i++) {
    const owner = await User.findOne({ username: `${defaultOwner}` });

    const location = pickOne(cities);

    // console.log(owner._id); // for some reason if id was asked in the same line, it returns undefined, but on a different line it returns the id

    const lib = new Library({
      name: `${pickOne(seedName.verbs)} ${pickOne(seedName.nouns)}`,
      description: getRandomSentence(),
      images: [
        {
          url: `https://picsum.photos/600/900?random=${randomNumber(20, 1)}`,
          filename: "default",
        },
        {
          url: `https://picsum.photos/600/900?random=${randomNumber(20, 1)}`,
          filename: "default",
        },
        {
          url: `https://picsum.photos/600/900?random=${randomNumber(20, 1)}`,
          filename: "default",
        },
      ],
      fee: randomNumber(),
      location: `${location.city}, ${location.state}`,
      geometry: {
        type: "Point",
        coordinates: [location.longitude, location.latitude],
      },
      owner: `${owner._id}`,
      // reviews: [],
    });
    await lib.save(); //save the new lib
  }
} //generate 50 new items with randomized name and locations

seedDB(); //run seedDB

console.log("---> Database seeded!");
// process.exit();
