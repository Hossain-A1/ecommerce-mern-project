const express = require("express");
const {
  getUsers,

  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
  updateUserById,
  handleChangeStatusUserById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
} = require("../controllers/userController");
const { validateUserRegistration, validateUserPassword, validateUserForgetPassword, validateUserResetPassword } = require("../validators/auth");
const runValidation = require("../validators");
const uploadUserImage = require("../middleware/uploadUserImage");
const {
  isLoggedIn,
  isLoggeOut,
  isAdmin,
} = require("../middleware/authMiddleware");

const userRouter = express.Router();
//register
userRouter.post(
  "/process-register",
  uploadUserImage.single("image"),
  validateUserRegistration,
  runValidation,
  isLoggeOut,
  processRegister
);

userRouter.post("/verify", isLoggeOut, activateUserAccount);
userRouter.get("/",isLoggedIn, isAdmin, getUsers);
userRouter.get("/:id", isLoggedIn, getUserById);
userRouter.delete("/:id", isLoggedIn, deleteUserById);

userRouter.put(
  "/reset-password",
  validateUserResetPassword,
  runValidation,
  handleResetPassword
);


userRouter.put(
  "/:id",
  uploadUserImage.single("image"),
  isLoggedIn,
  updateUserById
);

userRouter.put(
  "/ban-status-user/:id",
  isLoggedIn,
  isAdmin,
  handleChangeStatusUserById
);

userRouter.put(
  "/update-password/:id",
  validateUserPassword,
  runValidation,
  isLoggedIn,
  handleUpdatePassword
);

userRouter.post(
  "/forget-password",
  validateUserForgetPassword,
  runValidation,
  handleForgetPassword
);


module.exports = userRouter;
