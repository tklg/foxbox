const passport = require('passport')
const OAuth2Strategy = require('passport-oauth2').Strategy

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(async function (user, done) {
  await User.findOne({ id: user.id })
})

passport.use(new OAuth2Strategy({
  authorizationURL: 'https://www.example.com/oauth2/authorize',
  tokenURL: 'https://www.example.com/oauth2/token',
  clientID: AUTH3_CLIENT_ID,
  clientSecret: AUTH3_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/example/callback'
}, async function (accessToken, refreshToken, profile, cb) {
  const params = { provider: 'auth3', identifier: profile.id }
  const pass = await Passport.findOne(params)

  console.log(profile)
  if (pass) {
    const user = await User.findOne({ id: pass.user })
    return cb(user)
  } else {
    const user = await User.create()
    const pass = await Passport.create({
      ...params,
      user: user
    })
  }
}))

module.exports = {
  login: async (req, res, next) => {
    passport.authenticate('auth3', { scope: 'user.all' })(req, res, next)
  }
}
