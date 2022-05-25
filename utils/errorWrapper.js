// this is a try catch wrapper, it wraps whatever function passed in to it in a
// try catch, and catches any errors and passes it to the next error handler

module.exports = function errorWrapper(target) {
  return function (req, res, next) {
    target(req, res, next).catch(next);
  };
};
