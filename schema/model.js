const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fName: String,
  lName: String,
  displayName: String,
  email: String,
  phoneNumberHome: Number,
  phoneNumberWork: Number,
  location: String,
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = { UserModel };
