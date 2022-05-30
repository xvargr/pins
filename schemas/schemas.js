const Joi = require("joi");

module.exports.joiLibSchema = joiLibSchema = Joi.object({
  //define the joi schema here
  lib: Joi.object({
    //expect a lib object with these keys
    name: Joi.string().required(),
    description: Joi.string().required(),
    // image: ,
    fee: Joi.number().required().min(0),
    location: Joi.string().required(),
  }).required(), //the lib object is required
});
