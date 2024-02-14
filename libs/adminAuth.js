module.exports = async(req, res, next) =>{
  try {
    
    return next()
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized User"})
  }
} 