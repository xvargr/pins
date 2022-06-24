// router for /libraries path
const express = require("express");
const router = express.Router();

// import controller file
const userController = require("../controllers/users");

const errorWrapper = require("../utils/errorWrapper"); //import error wrapper function
// const ExpressError = require("../utils/ExpressError"); //import custom error class

const passport = require("passport");

// register user
router.post("/", errorWrapper(userController.register));

// log in user
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "back",
  }), // passport middleware, pass in the strategy and params
  errorWrapper(userController.logIn)
);

// log out user
router.get("/logout", userController.logOut);

module.exports = router;
