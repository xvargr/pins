// just a simpler wat to assign multiple values to flash at once
// there must be a better way to pass req in here
module.exports = function (req, status, message) {
  req.flash("status", status);
  req.flash("message", message);
};
