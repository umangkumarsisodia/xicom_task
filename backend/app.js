require("./config/db.config");
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const PORT = 3589;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/", require("./routes/index"));

app.get("/*", (req, res) => {
  return res.send("Hello from the server");
});

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
