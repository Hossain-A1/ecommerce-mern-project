const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAcccessKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      throw createHttpError(401, "Access token not found. Please login again");
    }

    const decoded = jwt.verify(accessToken, jwtAcccessKey);
    if (!decoded) {
      throw createHttpError(401, "Invalid access token. Please login again");
    }

    req.user = decoded.user;
    next();
  } catch (error) {
    return next(error);
  }
};

const isLoggeOut = async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;
    if (accessToken) {
      try {
        //check is the token is expried or not
        const decoded = jwt.verify(accessToken, jwtAcccessKey);
        if (decoded) {
          throw createHttpError(400, "User is already Logged In");
        }
      } catch (error) {
        throw error;
      }
    }

    next();
  } catch (error) {
    return next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw createHttpError(
        403,
        "Forbidden. You must be an admin to access to resource"
      );
    }
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { isLoggedIn, isLoggeOut, isAdmin };
