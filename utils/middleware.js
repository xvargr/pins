const flashMessage = require("../utils/flashMessage");

module.exports.isLoggedIn = function (req, res, next) {
  // uses the isAuthenticated passport middleware to check if user is signed in
  // this uses sessions
  if (req.isUnauthenticated()) {
    flashMessage(req, "error", "You need to sign in to view this page");
    return res.redirect("/libraries");
  }
  next();
};
