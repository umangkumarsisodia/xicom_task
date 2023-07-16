const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email : {
    type : String,
    required: true
  },
  dob : {
    type : Date,
    required : true
  }
});

const User = mongoose.model("xicom_user", userSchema);

module.exports = User;
