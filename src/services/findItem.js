const createHttpError = require("http-errors");
const  mongoose  = require("mongoose");

const findWithId = async (Model, id, options = {}) => {
  try {
    const item = await Model.findById(id, options);
    if (!item) {
      throw createHttpError(
        404,
        `${Model.modelName} does not exist with this id`
      );
    }
    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createHttpError(404, "Invalid user ID");
    }
    throw error;
  }
};

module.exports = { findWithId };
