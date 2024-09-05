const createError = require("http-errors");
const { successResponse } = require("./responseController");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");
const { createJSONWebToken } = require("../helpers/jsonwebtoken");
const {
  jwtActivationKey,
  clientURL,
  jwtrResetPasswordKey,
} = require("../secret");
const emailWithNodeMail = require("../helpers/email");
const {
  handleUserAction,
  findUsers,
  findUserById,
  removeUserById,
  updateUserWithId,
  updateUserPasswordId,
  forgetUserPasswordByEmail,
  resetUserPasswordByToken,
} = require("../services/userService");

//register a user
const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const image = req.file?.path;

    if (image && image.size > 1024 * 1024 * 2) {
      throw new Error("File too large");
    }

    const existEmail = await userModel.exists({ email: email });

    if (existEmail) {
      throw new Error("Email already used");
    }

    const tokenPayload = {
      name,
      email,
      password,
      address,
      phone,
    };

    if (image) {
      tokenPayload.image = image;
    }

    const token = createJSONWebToken(tokenPayload, jwtActivationKey, "3d");

    //prepare email
    const emailData = {
      email,
      subject: `Account Activation Email`,
      html: `
      <h2>Hello ${name}</h2>
      <p>Please click here to <a href='${clientURL}/api/users/activate/${token}' target="_blank">activate your account</a></p>
      `,
    };

    //send email with nodemailer
    try {
      await emailWithNodeMail(emailData);
    } catch (emailError) {
      next(createError(500, "Failed to send verifacition email"));
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} for completing your registration process.`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

//activate user account

const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, "Token not found");

    try {
      const decoded = jwt.verify(token, jwtActivationKey);

      if (!decoded) throw createError(401, "User was not verify");
      const existEmail = await userModel.exists({ email: decoded.email });

      if (existEmail) {
        throw new Error({ error: "Email already used please sign in" });
      }
      await userModel.create(decoded);

      return successResponse(res, {
        statusCode: 201,
        message: "User was registered successfully",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

// get all users
const getUsers = async (req, res, next) => {
  try {
    const seaarch = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const { users, pagination } = await findUsers(seaarch, page, limit);

    return successResponse(res, {
      statusCode: 200,
      message: "All User found",
      payload: {
        users: users,
        pagination: pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};
//get a sigle user
const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findUserById(id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "User ware returned successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

//delete a sigle user
const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    //get form service folder
    await removeUserById(id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "User ware deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

//update user by id
const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const updatedUser = await updateUserWithId(req, userId);

    return successResponse(res, {
      statusCode: 200,
      message: "User was updated successfully",
      payload: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

//banned user by id
const handleChangeStatusUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const action = req.body.action;

    const message = await handleUserAction(userId, action);
    return successResponse(res, {
      statusCode: 200,
      message,
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdatePassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword, confirmedPassword } = req.body;
    const userId = req.params.id;

    const updatePassword = await updateUserPasswordId(
      userId,
      email,
      oldPassword,
      newPassword,
      confirmedPassword
    );

    return successResponse(res, {
      statusCode: 200,
      message: "User was updated successfully",
      payload: { updatePassword },
    });
  } catch (error) {
    throw error;
  }
};

const handleForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = await forgetUserPasswordByEmail(email);

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} for completing your reseting password process.`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const handleResetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
await resetUserPasswordByToken(token,password)
  

    return successResponse(res, {
      statusCode: 200,
      message: "password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
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
};
