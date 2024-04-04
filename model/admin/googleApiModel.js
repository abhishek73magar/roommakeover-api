const { google } = require('googleapis')
const fs = require('fs')
const { MAIL_CLIENT_ID, MAIL_CLIENT_SECRET, MAIL_REDIRECT_URL, MAIL_USER } = require('../../config/config')
const { mailTransporter } = require('../../libs/mailTransporter')

let oauth2Client = new google.auth.OAuth2(MAIL_CLIENT_ID, MAIL_CLIENT_SECRET, MAIL_REDIRECT_URL);


exports.generateAuthUrlModel = async(body) => {
  try {
    if(oauth2Client === null) oauth2Client = new google.auth.OAuth2(MAIL_CLIENT_ID, MAIL_CLIENT_SECRET, MAIL_REDIRECT_URL)
    const scopes = ['https://mail.google.com']
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes, 
      prompt: 'consent'
    })
    
    return url;
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }

}

exports.oAuthTokenVerifyModel = async(query) => {
  try {
    const code = query.code;
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens);
    if(tokens.hasOwnProperty('refresh_token')){
      fs.writeFileSync('authtoken.json', JSON.stringify(tokens), 'utf-8')
      return tokens;
    } else { throw `refresh token is not generated! <br /> ${JSON.stringify(tokens)}`}
    
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

exports.testMailSendModel = async(body) => {
    try {
      const email = body.email
      if(!email || email === '') throw "Email is empty or invalid !!"
      const mailOptions = {
        from:`Roommakeover ${MAIL_USER}`,
        to: email,
        subject:'Test Email From roommakeover.com.np',
        html: "<p>This is test mail !!!</p>"
      }
      await mailTransporter(mailOptions)
      return "success"
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
}