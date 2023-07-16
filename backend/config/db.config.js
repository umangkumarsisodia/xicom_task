const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/xicom")
  .then(() => {
    console.log("DB connected!!");
  })
  .catch((error) => {
    console.log(error);
  });
