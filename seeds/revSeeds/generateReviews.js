const { readFileSync, promises: fsPromises } = require("fs");

const mongoose = require("mongoose"); //import mongoose module to work with mongo.db from js
const Review = require("../../models/reviews"); //import reviews model
const Library = require("../../models/libraries"); //import library model

const adjectiveFile = "../words/english-adjectives.txt";
const nounFile = "../words/english-nouns.txt";

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

//////////////////////////////////////////////////////////////////////////////////
const numOfReviews = 20; // how many reviews to make for each library

// node fs module, built in to read files, this one reads a txt file and exports an array
function syncReadFile(filename) {
  const contents = readFileSync(filename, "utf-8"); //insert filepath and the encoding format
  const arr = contents.split(/\r?\n/); // make an array from the output of readFileSync(), split the arrays where there is a line break, this is a regex
  //   console.log(arr); // 👉️ ['One', 'Two', 'Three', 'Four']
  return arr; //return that array
}

// make new adjective and noun arrays
const adjectives = syncReadFile(adjectiveFile);
const nouns = syncReadFile(nounFile);

function makeUsername(adjective, noun) {
  function pickOne(array) {
    return array[Math.floor(Math.random() * array.length)];
  } //function picks one of the index of an array on random
  const username = `${pickOne(adjectives)} ${pickOne(nouns)}`;
  return username;
}

// IN PROGRESS !!!
async function seedReviews() {
  // delete all reviews
  await Review.deleteMany({});
  // find all libraries
  const libs = await Library.find({});
  // for each library, make x amount of reviews
  for (let lib of libs) {
    console.log(lib.review);
    // STEPS
    // make username
    // make review text
    // make random rating 1-5
    // make new review
    for (let i; i < numOfReviews; i++) {
      const review = new Review({
        user: makeUsername(adjectives, nouns),
        text: "I used to practice weaving with spaghetti three hours a day but stopped because I didn't want to die alone.",
        rating: Math.floor(Math.random() * 5 + 1),
      });
    }
    // push to lib doc
    // save lib
    // save review
  }
}

seedReviews();