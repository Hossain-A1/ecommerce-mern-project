const jwt = require("jsonwebtoken");

const createJSONWebToken = (payload, secret, expiresIn) => {
  if (typeof payload !== "object" || !payload) {
    throw new Error("Payload must be a non-empty object");
  }
  if (typeof secret !== "string" || secret === "") {
    throw new Error("Secret must be a non-empty string");
  }
  try {
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
  } catch (error) {
    console.error("Failed to sign JWT", error);
    throw error;
  }
};

module.exports = { createJSONWebToken };
