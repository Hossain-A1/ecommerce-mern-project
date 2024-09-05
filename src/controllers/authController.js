const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { successResponse } = require("./responseController");
const { jwtAcccessKey } = require("../secret");
const { createJSONWebToken } = require("../helpers/jsonwebtoken");

const handleLogin = async (req, res, next) => {
  try {
    //email,password req.body

    const { email, password } = req.body;
    //isExist
    const user = await userModel.findOne({ email });

    if (!user) {
      throw new Error("With this email user does not exist");
    }

    //match the password

    const matchPass = await bcrypt.compare(password, user.password);

    if (!matchPass) {
      throw new Error(" Email or password not match");
    }

    //isBanned

    if (user.isBanned) {
      throw new Error("You are banned. please contact authority");
    }

    //token/cookei

    const userWithoutPassword = await userModel
      .findOne({ email })
      .select("-password");

    //create token
    const accessToken = createJSONWebToken({ user }, jwtAcccessKey, "1m");
    res.cookie("access_token", accessToken, {
      maxAge: 1 * 60 * 1000, //15minutes
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    //refresh token
  
    const refreshToken = createJSONWebToken({ user }, jwtAcccessKey, "7d");
    res.cookie("refresh_token", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, //7days
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return successResponse(res, {
      statusCode: 200,
      message: "User was successfully login",
      payload: { userWithoutPassword },
    });
  } catch (error) {
    next(error);
  }
};

const handleLogOut = async (req, res, next) => {
  try {
    //email,password req.body

    res.clearCookie("access_token");

    return successResponse(res, {
      statusCode: 200,
      message: "User logout successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleLogin, handleLogOut };
