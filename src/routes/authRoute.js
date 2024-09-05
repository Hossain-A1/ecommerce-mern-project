const express = require("express");
const { handleLogin, handleLogOut } = require("../controllers/authController");
const { isLoggeOut, isLoggedIn } = require("../middleware/authMiddleware");
const { validateUserLogin } = require("../validators/auth");
const runValidation = require("../validators");

const authRouter = express.Router();

authRouter.post(
  "/login",
  validateUserLogin,
  runValidation,
  isLoggeOut,
  handleLogin
);
authRouter.post("/logout", isLoggedIn, handleLogOut);

module.exports = authRouter;
