const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.ROOT_URL + '/connect/google/callback'
}, function (accessToken, refreshToken, profile, cb) {
  Passport.findOrCreate({ accountType: 'google', passportId: profile.id }, function (err, pass) {
    return cb(err, pass)
  })
})
)

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
    const provider = req.params.provider
    passport.authenticate(provider, { scope: ['profile'] })(req, res, next)
  },
  connectCallback: async (req, res, next) => {
    const provider = req.params.provider
    passport.authenticate(provider, { failureRedirect: '/login' })(req, res, (req, res) => {
      res.redirect('/box')
    })
  }
}
