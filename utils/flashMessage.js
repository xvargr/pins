// import flash for alert messages
const flash = require("connect-flash");

module.exports = function (req, status, message) {
  console.log(req);
  req.flash("status", status);
  req.flash("message", message);
};
