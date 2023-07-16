const mongoose = require("mongoose");
const User = require("./user");

const userDocsSchema = new mongoose.Schema({
  docs : {
    type : Array,
    required: true
  },
  userId : {
    type: mongoose.Schema.ObjectId,
    ref: User
  }
});

const Docs = mongoose.model("xicom_user_doc", userDocsSchema);

module.exports = Docs;
