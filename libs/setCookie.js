exports.setCookie = (res, name, value, expireDate) => {
  return res.cookie(name, value, {
    maxAge: expireDate,
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
  });
};
