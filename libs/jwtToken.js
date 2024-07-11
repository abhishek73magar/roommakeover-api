const jwt = require('jsonwebtoken')
const { SECRETKEY } = require('../config/config')

const generate = (users, expiresIn) => {
  if(!expiresIn) expiresIn = '1d'
  return jwt.sign({ ...users }, SECRETKEY, { expiresIn })
}

const verify = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRETKEY, (err, data) => {
      if(!!err) return reject(err.message ?? err)
      return resolve(data)
    })
  })
}


module.exports = { verify, generate }