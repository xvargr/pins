const Joi = require("joi");

// the joi schema for libraries
module.exports.joiLibSchema = Joi.object({
  //define the joi schema here
  lib: Joi.object({
    //expect a lib object with these keys
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object(),
    fee: Joi.number().required().min(0),
    location: Joi.string().required(),
  }).required(), //the lib object is required
});

// the joi schema for reviews
module.exports.joiRevSchema = Joi.object({
  review: Joi.object({
    user: Joi.string(),
    text: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(), // <-------- dont forget to make the main object required!
});
