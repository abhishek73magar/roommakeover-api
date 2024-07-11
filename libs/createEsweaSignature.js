const crypto = require('crypto')
const { ESEWA_SECRET } = require('../config/config')

module.exports = (data) => {
  // const secret = '8gBm/:&EnhH.1/q' // testing secret key
  const message = data.signed_field_names.split(',').map((field) => {
    if(field === 'total_amount') return `${field}=${data[field].toString().replace(/,/g, '')}`  
    return `${field}=${data[field] || ''}`
  }).join(',')
  const hmac = crypto.createHmac('sha256', ESEWA_SECRET)
  hmac.update(message)
  // console.log('\n')
  // console.log(message)

  const hashInBase64 = hmac.digest('base64')
  // const hash = crypto.HmacSHA256(message, secret)
  // const hashInBase64 = crypto.enc.Base64.stringify(hash)
  return hashInBase64
}