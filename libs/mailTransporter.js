const nodemailer = require("nodemailer");
const { google } = require('googleapis')
const moment = require('moment');
const { jwtDecode } = require("jwt-decode");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, MAIL_REDIRECT_URL, MAIL_REFRESH_TOKEN } = require("../config/config");

// const CLIENT_ID = process.env.MAIL_CLIENT_ID
// const CLIENT_SECRET = process.env.MAIL_CLIENT_SECRET
// const REDIRECT_URL = 'https://developer.google.com/oauthplayground'
// const REFRESH_TOKEN = process.env.MAIL_REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, MAIL_REDIRECT_URL)
oAuth2Client.setCredentials({ refresh_token: MAIL_REFRESH_TOKEN })

let transport = null;
let retry = 2
let token = null;

oAuth2Client.on('tokens', (tokens) => {
  console.log('gen token', new Date())
  // token = tokens.access_token
})

exports.getAccessToken = async(newToken = false) => {
  try {
    if(!token || newToken){ 
      const result = await oAuth2Client.getAccessToken() 
      token = result.token
    }
    return token;
  } catch (error) {
    // console.log(error.message)
    return Promise.reject(error.message ?? error)
  }
  

}

exports.mailTransporter = async(mailOptions, bulk=false, newToken=false) => {
  try {
    if(transport === null){
      const accessToken = await this.getAccessToken(newToken)
      transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: "OAUTH2",
          user: process.env.MAIL_USER,
          clientId: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          // refreshToken: REFRESH_TOKEN,
          accessToken: accessToken
        }
      });
    }

    if(bulk) {
      const result = await Promise.all(mailOptions.map((option) => transport.sendMail(option)))
      return result;
    }

    const result = await transport.sendMail(mailOptions)
    return result
  } catch (error) {
    if(retry > 0) {
      console.count('Retry: ')
      retry -= 1
      return this.mailTransporter(mailOptions, bulk, true)
    }
    retry = 2
    return Promise.reject(error.message ?? error)
  }
 
};