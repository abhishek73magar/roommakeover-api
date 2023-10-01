const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  const method = req.method;
  const notAllowGet = ["/checkout", "/wishlist", "/billingaddress", "/community/user"];

  const noAuth = ["/login", "/signin", "/loginwithsocial"];

  
  req.role = "admin";
  const check = notAllowGet.some((item) => req.url.includes(item));
  // console.log(check, req.url);
  if (noAuth.includes(req.url)) return next();
  if (method === "GET" && !check) return next();

  const { usertoken, admintoken } = req.cookies;

  // console.log(usertoken);
  if (usertoken) {
    jwt.verify(usertoken, process.env.SECRETKEY, (err, data) => {
      if (err) return res.status(401).json({ message: "Invalid User" });
      req.user = data;
      req.role = "client";
      return next();
    });
  } else if (admintoken) {
    jwt.verify(usertoken, process.env.SECRETKEY, (err, data) => {
      if (err) return res.status(401).json({ message: "Invalid User" });
      req.admin = data;
      req.role = "admin";
      return next();
    });
  } else {
    return res.status(401).json({ message: "User not allowed" });
  }

  // return next();
};
