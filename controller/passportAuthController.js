const crypto = require('crypto')
const { BASE_URL } = require('../config/config')
const { loginWithPassportModel } = require('../model/passportAuthModel')

exports.loginWithGoogleController = (req, res) => {
  const { sub: google_id, given_name: firstname, family_name: lastname, email } = req.user
  req.session.destroy((err) => (err) ? console.log(err) : null)
  
  return loginWithPassportModel({ google_id, firstname, lastname, email }, res, 'google')
    .then((response) => {
      // res.redirect(`${BASE_URL}/#/login?${response}`)
      const nonce = crypto.randomBytes(16).toString('base64')
      res.setHeader('Content-Security-Policy', `script-src 'self' 'nonce-${nonce}'`);
      console.log(response)
      return res.send(
        `
          <script nonce="${nonce}">
            if(window.opener){
              window.opener.postMessage({ type: "google-login", data: ${JSON.stringify(response)} }, '${BASE_URL}');
              window.close();
            }
          </script>
          `
        )
        })
        .catch((err) => res.status(400).send(err))
}


exports.loginWithFacebookController = (req, res) => {
  const { id: facebook_id, email, first_name: firstname, middle_name, last_name } = req.user._json;
  req.session.destroy((err) => (err) ? console.log(err) : null)
  const lastname = middle_name && middle_name !== '' ? `${middle_name} ${last_name}` : last_name

  return loginWithPassportModel({ facebook_id, firstname, lastname, email }, res, 'facebook')
  .then((response) => {
    // res.redirect(`${BASE_URL}/#/login?${response}`)
    const nonce = crypto.randomBytes(16).toString('base64')
    res.setHeader('Content-Security-Policy', `script-src 'self' 'nonce-${nonce}'`);
    console.log(response)
    return res.send(
      `
        <script nonce="${nonce}">
          if(window.opener){
            window.opener.postMessage({ type: "facebook-login", data: ${JSON.stringify(response)} }, '${BASE_URL}');
            window.close();
          }
        </script>
        `
      )
      })
      .catch((err) => res.status(400).send(err))
}