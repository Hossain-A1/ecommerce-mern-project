const mongoose = require("mongoose");
const { mongodbAtlasURL } = require("../secret");

const connectDB = async (options = {}) => {
  try {
    await mongoose.connect(mongodbAtlasURL, options);
    console.log("Connection to DB is successfull established");
    mongoose.connection.on("Error", (error) => {
      console.log(`DB connection error
        :${error}`);
    });
  } catch (error) {
    console.log(`Could not connect to DB
      :${error.toString()}`);
  }
};

module.exports = connectDB;
