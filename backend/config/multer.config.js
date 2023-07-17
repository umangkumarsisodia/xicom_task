const multer = require("multer");
const fs = require("fs");
const path = require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = './uploads';

    fs.mkdirSync(uploadFolder, { recursive: true });

    let subfolder;

    if (file.mimetype.startsWith("image/")) {
      subfolder = 'images';
    } else {
      subfolder = 'files';
    }

    const subfolderPath = path.join(uploadFolder, subfolder);
    if (!fs.existsSync(subfolderPath)) {
      fs.mkdirSync(subfolderPath);
    }

    cb(null, subfolderPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
