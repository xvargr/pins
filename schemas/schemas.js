const BaseJoi = require("joi");
const sanitizeHTML = require("sanitize-html");

// joi extension for sanitizing html
const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: { "string.escapeHTML": "{{#label}} must not include HTML" },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHTML(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension); // extend joi with html sanitizer extension

// the joi schema for libraries
module.exports.joiLibSchema = Joi.object({
  //define the joi schema here
  lib: Joi.object({
    //expect a lib object with these keys
    name: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    images: Joi.array(),
    fee: Joi.number().required().min(0),
    location: Joi.string().required().escapeHTML(),
  }).required(), //the lib object is required
  delImg: Joi.array(),
});

// the joi schema for reviews
module.exports.joiRevSchema = Joi.object({
  review: Joi.object({
    user: Joi.string().escapeHTML(),
    text: Joi.string().required().escapeHTML(),
    rating: Joi.number().required().min(1).max(5),
  }).required(), // <-------- don't forget to make the main object required!
});
