const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  const method = req.method;
  const notAllowGet = ["/checkout", "/wishlist", "/billingaddress"];
  const noAuth = ["/login", "/signin", "/loginwithsocial"];

  console.log(req.url, "-", new Date().toISOString(), "-", method);
  req.role = "admin";
  const check = notAllowGet.some((item) => req.url.includes(item));
  // console.log(check);
  if (noAuth.includes(req.url)) return next();
  if (method === "GET" && !check) return next();
  const { usertoken } = req.cookies;

  // console.log(usertoken);
  if (usertoken) {
    jwt.verify(usertoken, process.env.SECRETKEY, (err, data) => {
      if (err) return res.status(401).json({ message: "Invalid User" });
      req.user = data;
      req.role = "client";
      return next();
    });
  }

  // return next();
  // return res.status(401).json({ message: "User not allowed" });
};
