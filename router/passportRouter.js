const passport = require('passport')
const { loginWithGoogleController, loginWithFacebookController } = require('../controller/passportAuthController')

const router = require('express').Router()

// login with google
router
  .get('/google', passport.authenticate('google', { scope: ['email', 'profile']}))
  .get('/google/callback', passport.authenticate('google', { failureRedirect: "/api/google/failed", successRedirect: '/api/google/success' }))
  .get('/google/failed', (req, res) => res.redirect(`${BASE_URL}/login`))
  .get('/google/success', loginWithGoogleController)

// login with facebook 
router
  .get('/facebook', passport.authenticate('facebook', { scope: ['email']}))
  .get('/facebook/callback', passport.authenticate  ('facebook', { failureRedirect: "/api/google/failled", successRedirect: '/api/facebook/success'}))
  .get('/facebook/success', loginWithFacebookController)


module.exports = router