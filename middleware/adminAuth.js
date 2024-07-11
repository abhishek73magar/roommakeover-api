const jwt = require('jsonwebtoken')
const { ADMIN_SECRET } = require('../config/config')

const openPath = ['/login', '/oauth-code']

module.exports = async(req, res, next) =>{
  try {
    let url = req.url.split('?')[0]
    if(openPath.includes(url)) return next()
    const authorization = req.headers.authorization
    if(!authorization) throw "Authorization token not found !"

    const token = authorization.replace('Bearer ', '')
    const decode = jwt.verify(token,  ADMIN_SECRET)
    req.user = decode
    return next()
  } catch (error) {
    console.log(error.message ?? error)
    return res.status(401).send("Unauthorized User")
  }
} 