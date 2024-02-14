const jwt = require("jsonwebtoken");
exports.genToken = (user, expires = null, secretkey=process.env.SECRETKEY) => {
  expires = expires || "1d";
  return jwt.sign({ ...user }, secretkey, { expiresIn: expires });
};
