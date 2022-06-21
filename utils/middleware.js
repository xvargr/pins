const flashMessage = require("../utils/flashMessage");

module.exports.isLoggedIn = function (req, res, next) {
  // uses the isAuthenticated passport middleware to check if user is signed in
  // this uses sessions
  // console.log(req.user);
  if (req.isUnauthenticated()) {
    flashMessage(req, "error", "You need to sign in to view this page");
    // console.log(req.path);
    // console.log(req.session.currPath);
    const reroute = req.session.lastPath;
    return res.redirect(reroute); // redirect back to where user was before accessing prohibited page
  }
  next();
};
