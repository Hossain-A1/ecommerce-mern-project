const fs = require("fs").promises;
const deleteImage = async (userImagePath) => {
  try {
    await fs.access(userImagePath);
    await fs.unlink(userImagePath);
    console.log("User image deleted");
  } catch (error) {
    console.error("User image dose not exist");
  }
};

module.exports = deleteImage;
