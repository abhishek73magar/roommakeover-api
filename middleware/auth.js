const jwtToken = require('../libs/jwtToken')

const notAllowGet = ["/checkout", "/wishlist", "/billingaddress", "/community/user", "/share-product/user", "/order", "/invoice"];
const noAuth = ["/login", "/signin", "/loginwithsocial", '/blog', '/sendmail'];

exports.auth = async (req, res, next) => {
  try {
    const method = req.method;
    if(req.url.includes('/productimages')) return next();
    if(req.url.includes('/category')) return next();  
    
    const check = notAllowGet.some((item) => req.url.includes(item));

    if (noAuth.includes(req.url)) return next();
    if (method === "GET" && !check) return next();
    const { usertoken } = req.cookies;

    if(!!usertoken){
      req.user = await jwtToken.verify(usertoken)
      return next()
    }

    throw new Error("Unauthorized user !!")
  } catch (error) {
    // console.log(error.message ?? error)
    return res.status(401).json({ message: "Unauthorized user !!" })
  }
  


  // return next();
};
