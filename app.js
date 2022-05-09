const express = require("express"); //import the express npm module for easy server setup
const app = express(); //mapping express to app
const path = require("path"); //import path npm module to work with folder structure easier

app.set("view engine", "ejs"); //set views engine to ejs
app.set("views", path.join(__dirname, "views")); //set views directory to a dynamic directory

const mongoose = require("mongoose"); //import mongoose module to work with mongo.db from js

const Library = require("./models/libraries"); //import library model

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

const port = 3000; //set listening port to this

app.listen(port, function () {
  console.log("---> App started");
  console.log(`---> Listening on port ${port}`);
}); //express start server

app.get("/", function (req, res) {
  res.render("home");
}); //run this when receiving get request to "/"

app.get("/newlibrary", async function (req, res) {
  const lib = new Library({
    name: "Test Library",
    description: "This is a test library",
  });
  await lib.save(); //wait for this to finish
  res.send(lib);
}); //create async function and create a new test library
