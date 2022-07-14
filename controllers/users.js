// controller file where the logic lives

//model imports
const User = require("../models/users");

// import flash for alert messages
const flashMessage = require("../utils/flashMessage");

module.exports.register = async function (req, res, next) {
  try {
    const { username, email, password } = req.body.user;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password); // this will hash and store the password
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      flashMessage(
        req,
        "success",
        `Successfully registered, welcome ${username}`
      );
      // console.log(registeredUser);
      res.redirect("/libraries");
    }); // logs in newly registered user with passport
  } catch (e) {
    flashMessage(req, "error", e.message);
    res.redirect("/libraries");
  }
};

module.exports.logIn = async function (req, res) {
  // after successful auth by passport, else, flash and redirect, as params show
  flashMessage(req, "success", `Welcome back ${req.user.username}`);
  res.redirect("back"); // using the sessions to store prev path doesn't work but this does
};

module.exports.logOut = function (req, res) {
  req.logOut((err) => {
    if (err) return next(err);
    flashMessage(req, "success", "Logged out");
    res.redirect("/libraries");
  });
};
