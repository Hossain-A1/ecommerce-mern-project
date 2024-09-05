const userModel = require("../models/userModel");
const data = require("../data/data");
const seedUser = async (req, res, next) => {
  try {
    //deleting all existing users
    await userModel.deleteMany({});

    //inserting new user
    const users = await userModel.insertMany(data.users);

    //usccess response
    return res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { seedUser };
