const passport = require('passport');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_AUTH_CALLBACK, FACEBOOK_CLIENT_ID, FACEBOOK_AUTH_CALLBACK, FACEBOOK_CLIENT_SECRET } = require('../config/config');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

// console.log(GOOGLE_AUTH_CALLBACK, GOOGLE_CLIENT_ID)
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_AUTH_CALLBACK,
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => done(null, profile)))

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_CLIENT_ID,
  clientSecret: FACEBOOK_CLIENT_SECRET,
  callbackURL: FACEBOOK_AUTH_CALLBACK,
  profileFields: ['id', 'emails', 'name']
}, (accessToken, refreshToken, profile, cb) => cb(null, profile)))