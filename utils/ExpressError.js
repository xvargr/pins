// this is a custom error class to handle async errors, adds message and status
// code attribute to the error class

class ExpressError extends Error {
  constructor(msg, status) {
    super();
    this.message = msg;
    this.status = status;
  }
}

module.exports = ExpressError;
