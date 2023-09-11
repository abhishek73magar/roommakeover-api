const moment = require("moment");

exports.setCookie = (res, name, value, expired) => {
  if(!expired) { expired = moment(0).add(1, 'day').valueOf() }
  return res.cookie(name, value, {
    maxAge: expired,
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
  });
};
