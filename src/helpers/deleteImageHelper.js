const fs = require("fs/promises");
const deleteImageHelper = async (imagePath) => {
  try {
    await fs.access(imagePath);
    await fs.unlink(imagePath);
    console.log("User image has deleted");
  } catch (error) {
    console.log("user image does not exist or could not be deleted");
    throw error;
  }
};

module.exports = deleteImageHelper;
