const jwt = require("jsonwebtoken");
exports.genToken = (user, expires = null) => {
  expires = expires || "1d";
  return jwt.sign({ ...user }, process.env.SECRETKEY, { expiresIn: expires });
};
