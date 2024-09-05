const { Schema, model } = require("mongoose");
const { defaultUserImage } = require("../secret");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      maxlength: [31, "User name not more than 31 characters"],
      minlength: [3, "user name would be more than 3 characters"],
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "User email is required"],
      trim: true,
      validate: {
        validator: function (v) {
          // Simple email validation RegExp
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },

    password: {
      type: String,
      required: [true, "User Password is required"],
      minlength: [6, "Password would be more than 6 characters"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
      type: String,
      default:defaultUserImage
     
    },
    address: {
      type: String,
      required: [true, "User address is required"],
      minlength: [3, "Address would be more than 6 characters"],
    },
    phone: {
      type: String,
      required: [true, "User phone is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userModel = model("users", userSchema);

module.exports = userModel;
