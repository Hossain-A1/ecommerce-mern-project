const multer = require("multer");
const {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  UPLOAD_USER_IMAGE_DIR,
} = require("../config");

const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_USER_IMAGE_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(new Error("Image file is not  allowed"), false);
  }

  cb(null, true);
};

const uploadUserImage = multer({
  storage: userStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter,
});

module.exports = uploadUserImage;
