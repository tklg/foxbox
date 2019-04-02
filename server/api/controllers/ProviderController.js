const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.ROOT_URL + '/connect/google/callback',
  passReqToCallback: true
}, async function (req, accessToken, refreshToken, profile, cb) {
  const pass = await Passport.findOrCreate({ provider: 'google', identifier: profile.id })
  cb(pass)
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
    passport.authorize(provider, { failureRedirect: '/login' })(req, res, (req, res) => {
      res.redirect('/box')
    })
  }
}
