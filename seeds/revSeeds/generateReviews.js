const { readFileSync } = require("fs");

const mongoose = require("mongoose"); //import mongoose module to work with mongo.db from js
const Review = require("../../models/reviews"); //import reviews model
const Library = require("../../models/libraries"); //import library model
const User = require("../../models/users");

const adjectiveFile = "../words/english-adjectives.txt"; // path is relative to the node console
const nounFile = "../words/english-nouns.txt"; // todo make path absolute

mongoose.connect("", {
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

function makeUsername(adjectives, nouns) {
  function pickOne(array) {
    return array[Math.floor(Math.random() * array.length)];
  } //function picks one of the index of an array on random
  const username = `${pickOne(adjectives)} ${pickOne(nouns)}`;
  return username;
}

// Main function
async function generateReviews() {
  const libraries = await Library.find({}); // create new library array from all libs
  await Library.updateMany({}, { reviews: [] }); // clear all review fields
  const defaultOwner = "admin";
  // create x num of reviews for each lib
  for (const library of libraries) {
    const owner = await User.findOne({ username: `${defaultOwner}` });
    for (let i = 0; i < numOfReviews; i++) {
      let review = new Review({
        owner: `${owner._id}`,
        text: "I used to practice weaving with spaghetti three hours a day but stopped because I didn't want to die alone.",
        rating: Math.floor(Math.random() * 5 + 1),
      });
      library.reviews.push(review); // push new review to current lib
      await review.save();
    }
    await library.save();
  }
  console.log("---> reviews seeded");
  // console.log(await Rev.find({}));
}

generateReviews();
