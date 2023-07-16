const mongoose = require("mongoose");
const User = require("./user");

const userAddressSchema = new mongoose.Schema({
  r_street1: {
    type: String,
    required: true,
  },
  r_street2: {
    type: String,
    required: true,
  },
  p_street1: {
    type: String,
  },
  p_street2: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: User,
  },
});

const Address = mongoose.model("xicom_user_address", userAddressSchema);

module.exports = Address;
