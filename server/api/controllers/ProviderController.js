/* global Log Passport */
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const TAG = 'ProviderController'

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.ROOT_URL + '/connect/google/callback',
  passReqToCallback: true
}, async function (req, accessToken, refreshToken, profile, cb) {
  Log.d(TAG, req.user)
  const pass = await Passport.findOrCreate({ provider: 'google', identifier: profile.id, user: req.user })

  if (accessToken) pass.accessToken = accessToken
  if (refreshToken) pass.refreshToken = refreshToken
  if (accessToken || refreshToken) await pass.save()

  cb(null, pass, profile, null)
}))

module.exports = {
  list: async (req, res) => {
    res.json([{
      name: 'Gmail',
      icon: 'gmail'
    }, {
      name: 'Outlook',
      icon: 'outlook'
    }, {
      name: 'Other',
      icon: 'at'
    }])
  },
  connect: async (req, res, next) => {
    let provider = req.params.provider
    if (provider === 'gmail') provider = 'google'
    let scope
    switch (provider) {
      case 'google': scope = [ 'profile', 'https://mail.google.com/' ]
    }
    passport.authorize(provider, { scope: scope })(req, res, next)
  },
  connectCallback: async (req, res, next) => {
    let provider = req.params.provider
    if (provider === 'gmail') provider = 'google'
    passport.authorize(provider, async (e, pass, info, status) => {
      if (e) {
        Log.e(TAG, e)
      }

      const user = req.user
      pass.user = user
      await pass.save()

      if (process.env.NODE_ENV === 'development') return res.redirect('http://localhost:3000/box')
      res.redirect('/box')
    })(req, res, next)
  }
}
