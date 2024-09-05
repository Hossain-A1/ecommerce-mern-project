require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 4001;

const mongodbAtlasURL =
  process.env.MONGO_DB_ATLAS_URL || "mongodb://localhost:27017/commerceMernDB";

const defaultUserImage =
  process.env.DEFAULT_USER_IMAGE || "public/images/users/profle_image.png";

const jwtActivationKey = process.env.JWT_SECRET_KEY || "NVc20f8mYMGqbOTgKHkdi6uE2yri5Vkeaei5hKDVEZnSTyBgNB";
const jwtAcccessKey = process.env.JWT_ACCESS_KEY || "NVc20f8mYMGqbOTgKHkdi6uE2yri5Vkeaei5";
const jwtrResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY || "NVc20f8mYMGqbOT";


const clientURL = process.env.CLINET_URL || "";

const smtpUserName = process.env.SMTP_USERANAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "lwsraxutifepjvap";
// ------------------- //

module.exports = {
  serverPort,
  mongodbAtlasURL,
  defaultUserImage,
  jwtActivationKey,
  smtpUserName,
  smtpPassword,
  clientURL,
  jwtAcccessKey,
  jwtrResetPasswordKey
};
