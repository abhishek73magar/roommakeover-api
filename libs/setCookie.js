exports.setCookie = (res, name, value, expireDate) => {
  return res.cookie(name, value, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "none",
    maxAge: expireDate,
  });
};
