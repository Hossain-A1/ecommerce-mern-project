const createError = require("http-errors");
const mongoose  = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const userModel = require("../models/userModel");
const deleteImageHelper = require("../helpers/deleteImageHelper");
const { jwtrResetPasswordKey, clientURL } = require("../secret");
const { createJSONWebToken } = require("../helpers/jsonwebtoken");
const sendEmail = require("../helpers/sendEmail");

const handleUserAction = async (userId, action) => {
  try {
    let update;
    let message;
    if (action === "ban") {
      update = { isBanned: true };
      message = "User has banned successfully";
    } else if (action === "unban") {
      update = { isBanned: false };
      message = "User has unBanned successfully";
    } else {
      throw createError(
        400,
        'Invalid action. Action would be "ban" or "unbann" '
      );
    }

    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, update, updateOptions)
      .select("-password");

    if (!updatedUser) {
      throw new Error("User was not banned successfully");
    }

    return message;
  } catch (error) {
    if(error instanceof mongoose.Error.CastError){
      throw createError(400,'Invalid mongoose id')
          }
    throw error;
  }
};

const findUsers = async (seaarch, page, limit) => {
  try {
    const searchRegExp = new RegExp(".*" + seaarch + ".*", "i");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };

    const options = { password: 0 };
    const users = await userModel
      .find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await userModel.find(filter).countDocuments();

    if (!users || users.length === 0) {
      throw createError(404, "User not found");
    }

    return {
      users,
      pagination: {
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        prevPage: page - 1 > 0 ? page - 1 : null,
        nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
      },
    };
  } catch (error) {
    throw error;
  }
};

const findUserById = async (id, potion) => {
  try {
    const user = await userModel.findById(id, potion);
    if (!user) createError(404, "User not found");
    return user;
  } catch (error) {
    if(error instanceof mongoose.Error.CastError){
      throw createError(400,'Invalid mongoose id')
          }
    throw error
  }
};

const removeUserById = async (id, potion = {}) => {
  try {
    const user = await userModel.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });

    if (user && user.image) {
      await deleteImageHelper(user.image);
    }
  } catch (error) {
    if(error instanceof mongoose.Error.CastError){
      throw createError(400,'Invalid mongoose id')
          }
    throw error
  }
};

const updateUserWithId = async (req, userId) => {
  try {
    const updateOptions = { new: true, runValidators: true, context: "query" };

    let updates = {};
    const allowedFields = ["name", "password", "phone", "address"];

    for (key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      } else if (key === "email") {
        throw new Error("Email can not be updated");
      }
    }

    const image = req.file?.path;

    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw new Error("File too large");
      }

      updates.image = image;

      updates.image === "default.png" && deleteImageHelper(user.image);
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updates, updateOptions)
      .select("-password");

    if (!updatedUser) {
      throw createError(404, "User not exist with this id");
    }
    return updatedUser;
  } catch (error) {
    if(error instanceof mongoose.Error.CastError){
throw createError(400,'Invalid mongoose id')
    }
    throw error;
  }
};

const updateUserPasswordId = async (userId,email, oldPassword, newPassword,confirmedPassword) => {
  try {
    //isExist
    const user = await userModel.findOne({email:email});
    if(!user){
      throw createError(404,"User not found with this email")
    }

    if(newPassword !== confirmedPassword){
      throw createError(400,"Password did not match")
    }
    //match the password
    const matchPass = await bcrypt.compare(oldPassword, user.password);

    if (!matchPass) {
      throw new Error("old password incorrect");
    }

    //this way you can update user password
    // const filter = {userId}
    // const updates = {$set:{password:newPassword}}
    // const updateOptions = {new:true}

    const updatePassword = await userModel
      .findByIdAndUpdate(userId,{ password: newPassword }, { new: true })
      .select("-password");

    if (!updatePassword) {
      throw createError(404, "Not update new password");
    }
return updatePassword
  } catch (error) {
    if(error instanceof mongoose.Error.CastError){
throw createError(400,'Invalid mongoose id')
    }
    throw error;
  }
};

const forgetUserPasswordByEmail = async(email)=>{
  try {
    
     //isExist
     const user = await userModel.findOne({ email: email });
     if (!user) {
       throw createError(
         404,
         "User not found with this email or you have not verified your email address"
       );
     }
 
     const token = createJSONWebToken({ email }, jwtrResetPasswordKey, "3d");
 
     //prepare email
     const emailData = {
       email,
       subject: `Reset Password Email`,
       html: `
        <h2>Hello ${user.name}</h2>
        <p>Please click here to <a href='${clientURL}/api/users/reset-password/${token}' target="_blank"> Reset your password</a></p>
        `,
     };
 
     //send email with nodemailer
     
  sendEmail(emailData)
     return token
  } catch (error) {
    throw error
  }
}

const resetUserPasswordByToken = async(token, password)=>{
  try {
    const decoded = jwt.verify(token, jwtrResetPasswordKey);
    if (!decoded) {
      throw createError(400, "Invalid or expired token");
    }

    const filter = { email: decoded.email };
    const update = { password: password };
    const options = { new: true };

    const updatedUser = await userModel
      .findOneAndUpdate(filter, update, options)
      .select("-password");

    if (!updatedUser) {
      throw createError(400, "password reset failed");
    }
  } catch (error) {
    throw error
  }
}
module.exports = {
  handleUserAction,
  findUsers,
  findUserById,
  removeUserById,
  updateUserWithId,
  updateUserPasswordId,
  forgetUserPasswordByEmail,
  resetUserPasswordByToken
};
