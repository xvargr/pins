// router for /libraries path
const express = require("express");
const router = express.Router();

const errorWrapper = require("../utils/errorWrapper"); //import error wrapper function

// import controller file
const libraryController = require("../controllers/libraries");

// imports middleware, checks for authentication
const { isLoggedIn, isOwner, joiLibValidate } = require("../utils/middleware"); // import auth check middleware for routes

// multer multipart form data parser import, and cloudinary/cldStorage import from settings file
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage }); // defining multer upload to storage, set up in cloudinary config

// index page and post req
router.route("/").get(errorWrapper(libraryController.index)).post(
  isLoggedIn,
  upload.array("lib[img]"), // upload multer cloud image middleware
  joiLibValidate,
  errorWrapper(libraryController.newLibrary)
);

// NOTE
//; if get /:id is placed before /new, express will try to
// search and match a details page with the id of "new".
// place get /new first to solve this issue

//new form route for to create libraries
router.get("/new", isLoggedIn, libraryController.newForm);
// multer gives access to the upload.single, array, fields methods to capture uploaded files in forms (upload. is the object here because we set upload to multer({}))
// it will parse form data to req.body as usual, but will take any file upload and put it in req.file

// details, update, delete specific doc
router
  .route("/:id")
  .get(errorWrapper(libraryController.details))
  .post(
    isLoggedIn,
    joiLibValidate,
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
