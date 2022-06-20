// router for /libraries path
const express = require("express");
const router = express.Router();

const errorWrapper = require("../utils/errorWrapper"); //import error wrapper function
// const ExpressError = require("../utils/ExpressError"); //import custom error class

// import flash for alert messages
const flashMessage = require("../utils/flashMessage");

const User = require("../models/users");
const passport = require("passport");

// register user
router.post(
  "/",
  errorWrapper(async function (req, res) {
    try {
      const { username, email, password } = req.body.user;
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password); // this will hash and store the password
      flashMessage(req, "success", "Successfully registered");
      console.log(registeredUser);
      res.redirect("/libraries");
    } catch (e) {
      flashMessage(req, "error", e.message);
      res.redirect("/libraries");
    }
  })
);

// log in user
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/libraries",
  }), // passport middleware, pass in the strategy and params
  errorWrapper(async function (req, res) {
    // after successful auth by passport, else, flash and redirect, as params show
    flashMessage(req, "success", "Welcome back");
    res.redirect("/libraries");
  })
);

// log out user
router.get("/logout", function (req, res) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    flashMessage(req, "success", "Logged out");
    res.redirect("/libraries");
  });
});

module.exports = router;
