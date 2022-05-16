// npm init

const express = require("express"); //import the express npm module for easy server setup
const app = express(); //mapping express to app

const path = require("path"); //import path npm module to work with folder structure easier

const engine = require("ejs-mate"); //import ejs-mate engine for templating and boilerplate
app.engine("ejs", engine); //change default engine to ejs-mate

app.set("view engine", "ejs"); //set views engine to ejs
app.set("views", path.join(__dirname, "views")); //set views directory to a dynamic directory

const formMethod = require("method-override"); //gives forms access to more methods
app.use(formMethod("_method")); //defining methodOverride query value

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

app.use(express.urlencoded({ extended: true })); //express middleware body parser
app.use(express.static(__dirname + "/")); //serve static files at "/" directory with express

app.listen(port, function () {
  console.log("---> App started");
  console.log(`---> Listening on port ${port}`);
}); //express start server

// TODO: streamline requests with more advanced express router to
// reduce duplicate code

app.get("/libraries", async function (req, res) {
  const result = await Library.find({});
  res.render("libraries/index", { result, req });
}); //run this when receiving get request to "/"

//; if get /:id is placed before /new, express will try to
//try to search and match a details page with the id of "new".
//place get /new first to solve this issue

app.get("/libraries/new", function (req, res) {
  res.render("libraries/new", { req });
}); //new form route for to create libraries

app.get("/libraries/:id", async function (req, res) {
  const { id } = req.params; //destructure req.params to get id
  const result = await Library.findById(id);
  res.render("libraries/details", { result, req });
}); //details route for specific libraries

app.get("/libraries/:id/edit", async function (req, res) {
  const { id } = req.params;
  const result = await Library.findById(id);
  res.render("libraries/edit", { result, req });
}); //serve edit form

app.post("/libraries", async function (req, res) {
  //res.send(req.body); //by default, req.body is empty, it needs to be parsed
  const lib = new Library(req.body.lib);
  await lib.save();
  res.redirect(`/libraries/${lib._id}`);
}); // post req new library

app.put("/libraries/:id", async function (req, res) {
  const { id } = req.params;
  await Library.findByIdAndUpdate(id, { ...req.body.lib }); //spread operator pass all elements of iterable lib
  res.redirect(`/libraries/${id}`);
}); //update route

app.delete("/libraries/:id", async function (req, res) {
  const { id } = req.params;
  await Library.findByIdAndDelete(id);
  res.redirect("/libraries");
}); //delete route

// app.get("/newlibrary", async function (req, res) {
//   const lib = new Library({
//     name: "Test Library",
//     description: "This is a test library",
//   });
//   await lib.save(); //wait for this to finish
//   res.send(lib);
// }); //create async function and create a new test library
