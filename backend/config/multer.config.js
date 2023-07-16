const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;
    if (file.mimetype.startsWith("image/")) {
      folder = "./uploads/images";
    } else {
      folder = "./uploads/files";
    }

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
