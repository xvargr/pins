// router for /libraries path
const express = require("express");
const router = express.Router();

const errorWrapper = require("../utils/errorWrapper"); //import error wrapper function

// import flash for alert messages
const flashMessage = require("../utils/flashMessage");

// imports middleware, checks for authentication
const {
  isLoggedIn,
  isLibOwner,
  joiLibValidate,
} = require("../utils/middleware"); // import auth check middleware for routes

//import schema models
const Library = require("../models/libraries");

// show all route
router.get("/", async function (req, res) {
  const result = await Library.find({});
  res.render("libraries/index", { result, req });
}); //run this when receiving get request to "/"

//; if get /:id is placed before /new, express will try to
//try to search and match a details page with the id of "new".
//place get /new first to solve this issue

//new form route for to create libraries
router.get("/new", isLoggedIn, function (req, res) {
  res.render("libraries/new", { req });
});

//details route
router.get(
  "/:id",
  errorWrapper(async function (req, res) {
    const { id } = req.params; //destructure req.params to get id
    const result = await Library.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "owner",
          model: "User",
        },
      })
      .populate("owner");
    // if (!result) { // does not work, mongo error id invalid
    //   flashMessage(req, "error", "no libraries found matching that id");
    //   return res.redirect("libraries");
    // }
    // console.log(result.reviews);
    res.render("libraries/details", { result, req });
  })
);

// edit form route
router.get(
  "/:id/edit",
  isLoggedIn,
  isLibOwner,
  errorWrapper(async function (req, res) {
    const { id } = req.params;
    const result = await Library.findById(id);
    res.render("libraries/edit", { result, req });
  })
);

// post req new library
router.post(
  "/",
  joiLibValidate,
  isLoggedIn,
  errorWrapper(async function (req, res) {
    // the error wrapper is used to wrap this function in a try catch to catch any async errors
    // res.send(req.body); //by default, req.body is empty, it needs to be parsed
    // if (!req.body.lib) throw new ExpressError("Form data is unavailable", 400); //if body.lib does not exist, throw this error // replaced with joi
    const lib = new Library(req.body.lib);
    lib.owner = req.user._id; // assigns the current logged in user as the owner of the new lib
    await lib.save();
    flashMessage(req, "success", "successfully created new library");
    res.redirect(`/libraries/${lib._id}`);
  })
);

//update route
router.put(
  "/:id",
  joiLibValidate,
  isLoggedIn,
  isLibOwner,
  errorWrapper(async function (req, res) {
    const { id } = req.params;
    // await Library.findByIdAndUpdate(
    //   id,
    //   { ...req.body.lib },
    //   { runValidators: true }
    // ); //spread operator pass all elements of iterable lib
    const lib = await Library.findById(id);
    let reviews = lib.reviews; // keep reviews
    // if current logged in user is not owner, flash and redirect, else proceed
    // if (req.user._id.valueOf() !== lib.owner.valueOf()) {
    //   flashMessage(req, "error", "You must be the owner to update");
    //   return res.redirect(`/libraries/${id}`);
    // }
    lib.overwrite({ ...req.body.lib }, { runValidators: true });
    lib.owner = req.user._id;
    lib.reviews = reviews;
    await lib.save();
    flashMessage(req, "success", "successfully updated library");
    res.redirect(`/libraries/${id}`);
  })
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isLibOwner,
  errorWrapper(async function (req, res) {
    const { id } = req.params;
    await Library.findByIdAndDelete(id);
    flashMessage(req, "success", "successfully deleted library");
    res.redirect("/libraries");
  })
);

module.exports = router;
