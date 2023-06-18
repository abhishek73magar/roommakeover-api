exports.setCookie = (res, name, value, expireDate) => {
  return res.cookie(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: expireDate * 1000,
  });
};
