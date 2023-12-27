const nodemailer = require("nodemailer");
const { google } = require('googleapis')

const CLIENT_ID = process.env.MAIL_CLIENT_ID
const CLIENT_SECRET = process.env.MAIL_CLIENT_SECRET
const REDIRECT_URL = 'https://developer.google.com/oauthplayground'
const REFRESH_TOKEN = process.env.MAIL_REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

module.exports = async(mailOptions) => {
  try {
    const access_token = await oAuth2Client.getAccessToken()
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: "OAUTH2",
        user: process.env.MAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: access_token.token
      }
    });

    const result = await transport.sendMail(mailOptions)
    return result
  } catch (error) {
    return error
  }
 
};