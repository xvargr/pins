const mongoose = require("mongoose");
const passLocMongoose = require("passport-local-mongoose"); // passport auth mongoose models specific package

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
// USERNAME AND PASSWORD PROVIDED HERE vvvv
UserSchema.plugin(passLocMongoose); // adds a username, hash and salt field to UserSchema
// additionally, it also adds some methods to UserSchema

module.exports = mongoose.model("User", UserSchema);
