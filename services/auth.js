const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function generateUserToken(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImgUrl: user.profileImgUrl,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
}

function tokenValidation(token) {
  const payload = JWT.verify(token, process.env.JWT_SECRET);
  return payload;
}

module.exports = {
  generateUserToken,
  tokenValidation,
};
