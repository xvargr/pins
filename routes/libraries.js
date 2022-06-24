// router for /libraries path
const express = require("express");
const router = express.Router();

const errorWrapper = require("../utils/errorWrapper"); //import error wrapper function

// import controller file
const libraryController = require("../controllers/libraries");

// imports middleware, checks for authentication
const { isLoggedIn, isOwner, joiLibValidate } = require("../utils/middleware"); // import auth check middleware for routes

// index page and post req
router
  .route("/")
  .get(errorWrapper(libraryController.index))
  .post(joiLibValidate, isLoggedIn, errorWrapper(libraryController.newLibrary));

// NOTE
//; if get /:id is placed before /new, express will try to
// search and match a details page with the id of "new".
// place get /new first to solve this issue

//new form route for to create libraries
router.get("/new", isLoggedIn, libraryController.newForm);

// details, update, delete specific doc
router
  .route("/:id")
  .get(errorWrapper(libraryController.details))
  .post(
    joiLibValidate,
    isLoggedIn,
    isOwner,
    errorWrapper(libraryController.updateLibrary)
  )
  .delete(isLoggedIn, isOwner, errorWrapper(libraryController.deleteLibrary));

// edit form route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  errorWrapper(libraryController.editForm)
);

module.exports = router;
