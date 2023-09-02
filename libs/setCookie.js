const moment = require("moment");
exports.setCookie = (res, name, value, expireDate) => {
  console.log(moment(expireDate).format());
  return res.cookie(name, value, {
    maxAge: expireDate,
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
  });
};
