const { body } = require("express-validator");
//registration validators

const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 31 })
    .withMessage("Name should be at last 3-31 characters long"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password should be at last 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password should contain at last one uppercase letter, one lowercase letter, one number, and one symbo"
    ),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Arrdess is required")
    .isLength({ min: 3 })
    .withMessage("Address should be at last 3 characters long"),
  body("phone").trim().notEmpty().withMessage("Phone is required"),
  body("image").optional().isString().withMessage("User image is optional"),
];

const validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Passwor should be at last 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password should contain at last one uppercase letter, one lowercase letter, one number, and one symbo"
    ),
  body("address"),
];

const validateUserPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),

  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("old Password is required")
    .isLength({ min: 6 })
    .withMessage(" old passwor should be at last 6 characters long"),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("new Password is required")
    .isLength({ min: 6 })
    .withMessage(" new passwor should be at last 6 characters long"),
  body("confirmedPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Password did not match");
    }
    return true;
  }),
];

const validateUserForgetPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
];

const validateUserResetPassword = [
  body("token").trim().notEmpty().withMessage("Token is missing."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Passwor should be at last 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password should contain at last one uppercase letter, one lowercase letter, one number, and one symbo"
    ),
  body("address"),
];
module.exports = {
  validateUserPassword,
  validateUserRegistration,
  validateUserLogin,
  validateUserForgetPassword,
  validateUserResetPassword,
};
