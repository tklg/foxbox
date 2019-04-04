/* global Log User Passport AccessToken RefreshToken */
const passport = require('passport')
const https = require('https')
const OAuth2Strategy = require('passport-oauth2').Strategy
const TAG = 'AuthController'

passport.serializeUser(function (user, done) {
  // Log.d(TAG, 's user: ' + user.id)
  done(null, user.id)
})

passport.deserializeUser(async function (user, done) {
  const u = await User.findOne({ id: user })
  // Log.d(TAG, 'de user: ' + u.id)
  if (!u) return done(new Error('user not found: ' + user))
  done(null, u)
})

const client = new OAuth2Strategy({
  authorizationURL: 'https://auth.tkluge.net/authorize',
  tokenURL: 'https://auth.tkluge.net/api/token',
  clientID: process.env.AUTH3_CLIENT_ID,
  clientSecret: process.env.AUTH3_CLIENT_SECRET,
  callbackURL: process.env.ROOT_URL + '/login/callback'
}, async function (accessToken, refreshToken, profile, cb) {
  const params = { provider: 'auth3', identifier: profile.uuid }
  const pass = await Passport.findOne(params)

  if (!profile) return cb(new Error('missing profile'))

  if (pass) {
    const user = await User.findOne({ id: pass.user })
    await pass.update({
      accessToken,
      refreshToken
    })
    cb(null, user, profile, null)
  } else {
    const user = await User.create({ email: profile.email })
    await Passport.create({
      ...params,
      accessToken,
      refreshToken,
      user: user
    })
    cb(null, user, profile, null)
  }
})

client.userProfile = function (accessToken, done) {
  const req = https.get({
    hostname: 'auth.tkluge.net',
    path: '/api/user/info',
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  }, (res) => {
    res.setEncoding('utf8')
    let body = ''
    res.on('data', data => {
      body += data
    })
    res.on('end', () => {
      body = JSON.parse(body)
      done(null, body)
    })
  })

  req.on('error', e => {
    done(e, {})
  })
}

passport.use(client)

module.exports = {
  login: async (req, res, next) => {
    passport.authenticate('oauth2', { scope: ['user.name', 'user.email'] })(req, res, next)
  },
  loginCallback: async (req, res, next) => {
    passport.authenticate('oauth2', async (e, user, info, status) => {
      if (e) return Log.e(TAG, e)
      const accessToken = await AccessToken.create({ user })
      const refreshToken = await RefreshToken.findOne({ id: accessToken.refreshToken })

      req.login(user, () => {
        res.cookie('tok', JSON.stringify({
          access_token: accessToken.token,
          refresh_token: refreshToken.token,
          expires: accessToken.expiresAt
        }), { expiresAt: accessToken.expiresAt })
        if (req.query.next) {
          res.redirect(req.query.next)
        } else {
          if (process.env.NODE_ENV === 'development') return res.redirect('http://localhost:3000/box')
          res.redirect('/box')
        }
      })
    })(req, res, next)
  }
}
