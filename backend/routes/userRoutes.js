const router = require("express").Router();
const upload = require("../config/multer.config");
const { createUser, findUserByEmail } = require("../controllers/userControllers");

router.get("/checkUserExistence", findUserByEmail)
router.post("/createUser", upload.any("doc"), createUser);

module.exports = router;
