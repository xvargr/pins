// router for /libraries path
const express = require("express");
const router = express.Router();

const errorWrapper = require("../utils/errorWrapper"); //import error wrapper function
const ExpressError = require("../utils/ExpressError"); //import custom error class

// import flash for alert messages
const flashMessage = require("../utils/flashMessage");

// register user
router.post("/", async function (req, res) {});

module.exports = router;
